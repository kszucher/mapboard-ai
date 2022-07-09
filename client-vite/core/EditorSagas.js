import { all, call, put, select, take, race, delay } from 'redux-saga/effects'
import { initDomData } from './DomFlow'
import { mapref, mapStack, mapStackDispatch, push, saveMap } from './MapStackFlow'
import { selectionState } from './SelectionFlow'
import { mapDispatch, redraw } from './MapFlow'
import { mapGetProp } from '../map/MapGetProp'

const SAVE_INCLUDED = [
    'OPEN_MAP_FROM_TAB',
    'OPEN_MAP_FROM_MAP',
    'OPEN_MAP_FROM_BREADCRUMBS',
    'CREATE_MAP_IN_MAP',
    'CREATE_MAP_IN_TAB',
    'OPEN_FRAME',
    'IMPORT_FRAME',
    'DUPLICATE_FRAME',
    'OPEN_PREV_FRAME',
    'OPEN_NEXT_FRAME'
]

const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8082/beta'
    : 'https://mapboard-server.herokuapp.com/beta';

const fetchPost = (req) => {
    if ([
        'SIGN_IN',
        'SIGN_UP_STEP_1',
        'SIGN_UP_STEP_2',
        'LIVE_DEMO'
    ].includes(req.type)) {
        // auto sign-in gets cred from localStorage, manual sign-in gets cred from state
    } else {
        req = {...req, payload: {...req.payload, cred: JSON.parse(localStorage.getItem('cred')) }}
    }
    console.log('SERVER_MESSAGE: ' + req.type)
    return fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(req),
    }).then(resp => resp.json())
}

function* authSaga () {
    while (true) {
        const { type, payload } = yield take([
            'LIVE_DEMO',
            'SIGN_UP_STEP_1',
            'SIGN_UP_STEP_2',
            'SIGN_IN',
            'SET_CONFIRMATION_CODE',
        ])
        if (type === 'SIGN_IN' && (payload.cred.email === '' || payload.cred.password === '')) {
            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Missing information' })
        } else if (type === 'SIGN_IN' && payload.cred.password.length < 5) {
            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Too short password' })
        } else if (type === 'SIGN_UP_STEP_1' && payload.password.length < 5 ) {
            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Your password must be at least 5 characters' })
        } else if (type === 'SET_CONFIRMATION_CODE' && !isNaN(payload) && payload.length <= 4) {
            yield put({ type: 'SET_CONFIRMATION_CODE', payload })
        } else {
            yield put({type: 'INTERACTION_DISABLED'})
            const { resp: { error, data } } = yield call(fetchPost, { type, payload })
            yield put({type: 'INTERACTION_ENABLED'})
            if (error === 'authFailWrongCred') {
                localStorage.clear()
            } else if (error === 'signInFailIncompleteRegistration') {
                console.log('incomplete registration')
            } else {
                switch (type) {
                    case 'LIVE_DEMO':
                        initDomData()
                        yield put({ type: 'SHOW_DEMO' })
                        break
                    case 'SIGN_UP_STEP_1':
                        if (error === 'signUpStep1FailEmailAlreadyInUse') {
                            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Email address already in use' })
                        } else {
                            yield put({ type: 'SIGN_UP_STEP_2_PANEL' })
                        }
                        break
                    case 'SIGN_UP_STEP_2':
                        if (error === 'signUpStep2FailUnknownUser') {
                            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Unknown user' })
                        } else if (error === 'signUpStep2FailWrongCode') {
                            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Wrong code' })
                        } else if (error === 'signUpStep2FailAlreadyActivated') {
                            yield put({ type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Already activated' })
                        } else {
                            yield put({ type: 'SIGN_IN_PANEL' })
                        }
                        break
                    case 'SIGN_IN':
                        const { cred } = data
                        localStorage.setItem('cred', JSON.stringify(cred))
                        initDomData()
                        yield put({ type: 'SHOW_WS' })
                        break
                }
                yield put({ type: 'PARSE_RESP_PAYLOAD', payload: data })
            }
        }
    }
}

function* colorSaga () {
    while (true) {
        yield take('CHANGE_COLOR_MODE')
        const colorMode = (yield select(state => state.colorMode)) === 'light' ? 'dark' : 'light'
        yield put({ type: 'SET_COLOR_MODE', payload: colorMode})
        yield call(fetchPost, { type: 'CHANGE_COLOR_MODE', payload: {colorMode} })
    }
}

const AUTO_SAVE_STATES = {WAIT: 'WAIT', IDLE: 'IDLE'}
let autoSaveState = AUTO_SAVE_STATES.IDLE
function* autoSaveSaga() {
    while (true) {
        const { autoSaveNow, autoSaveLater, autoSaveNowByTimeout } = yield race({
            autoSaveNow: take(['SHOW_WS_CREATE_MAP_IN_MAP', ...SAVE_INCLUDED]),
            autoSaveLater: take(['UNDO', 'REDO', 'MAP_STACK_CHANGED',]),
            autoSaveNowByTimeout: delay(1000)
        })
        if (autoSaveNow) {
            autoSaveState = AUTO_SAVE_STATES.IDLE
        } else if (autoSaveLater) {
            autoSaveState = AUTO_SAVE_STATES.WAIT
        } else if (autoSaveNowByTimeout) {
            if (autoSaveState === AUTO_SAVE_STATES.WAIT) {
                autoSaveState = AUTO_SAVE_STATES.IDLE
                if (mapStack.data.length === 1 && mapStack.dataIndex === 0 ||
                    mapStack.data.length === 0) {
                    console.log('skip save')
                } else {
                    console.log('apply save')
                    yield put({ type: 'SAVE_MAP' })
                }
            }
        }
    }
}

function* saveSaga() {
    while (true) {
        yield take([
            'SHOW_WS_CREATE_MAP_IN_MAP'
        ])
        yield put({ type: 'SAVE_MAP' })
    }
}

function* mapSaga () {
    while (true) {
        let { type, payload } = yield take([
            'SAVE_MAP',
            ...SAVE_INCLUDED,
            'REMOVE_MAP_IN_TAB',
            'MOVE_UP_MAP_IN_TAB',
            'MOVE_DOWN_MAP_IN_TAB',
            'DELETE_FRAME',
            'GET_SHARES',
            'ACCEPT_SHARE',
            'DELETE_SHARE',
        ])
        if (['SAVE_MAP', ...SAVE_INCLUDED].includes(type)) {
            const mapId = yield select(state => state.mapId)
            const mapSource = yield select(state => state.mapSource)
            const mapData = saveMap()
            payload = { ...payload, save: { mapId, mapSource, mapData } }
        }
        if (type === 'OPEN_MAP_FROM_TAB') {
            const { tabMapSelected } = payload
            const tabMapIdList = yield select(state => state.tabMapIdList)
            const mapId = tabMapIdList[tabMapSelected]
            payload = { ...payload, mapId }
        }
        // TODO for completeness, assign mapId for OPEN_MAP_FROM_MAP HERE
        // TODO for symmetry, OPEN_MAP_FROM_BREADCRUMBS should also open based on id and not index
        if ([
            'REMOVE_MAP_IN_TAB',
            'MOVE_UP_MAP_IN_TAB',
            'MOVE_DOWN_MAP_IN_TAB',
            'OPEN_FRAME',
            'IMPORT_FRAME',
            'DUPLICATE_FRAME',
            'DELETE_FRAME',
            'OPEN_PREV_FRAME',
            'OPEN_NEXT_FRAME'
        ].includes(type)) {
            const mapId = yield select(state => state.mapId)
            payload = { ...payload, mapId }
        }
        if (type === 'CREATE_MAP_IN_MAP') {
            const { lastPath } = selectionState
            payload = { ...payload, lastPath, newMapName: mapref(lastPath).content }
        }
        if (type === 'DUPLICATE_FRAME') {
            payload = { ...payload, mapData: saveMap() }
        }
        yield put({type: 'INTERACTION_DISABLED'})
        const { resp: { error, data } } = yield call(fetchPost, { type, payload })
        yield put({type: 'INTERACTION_ENABLED'})
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: data })
        if (type === 'CREATE_MAP_IN_MAP') {
            yield put({type: 'SHOW_WS'})
        }
    }
}

function* mapStackEventSaga() {
    while (true) {
        const { type, payload } = yield take(['INSERT_TABLE', 'TOGGLE_TASK'])
        push()
        if (type === 'INSERT_TABLE') {
            mapDispatch('insertTable', payload)
        } else if (type === 'TOGGLE_TASK') {
            mapDispatch('toggleTask')
        }
        yield put({ type: 'MAP_STACK_CHANGED' })
        const colorMode = yield select(state => state.colorMode)
        redraw(colorMode)
        yield put({ type: 'SHOW_WS'})
    }
}

function* mapStackSaga () {
    while (true) {
        const { type } = yield take(['UNDO', 'REDO', 'MAP_STACK_CHANGED'])
        const colorMode = yield select(state => state.colorMode)
        switch (type) {
            case 'UNDO': { mapStackDispatch('undo'); redraw(colorMode); break }
            case 'REDO': { mapStackDispatch('redo'); redraw(colorMode); break }
        }
        let m = mapref(['m'])
        const lm = mapref(selectionState.lastPath)
        const { density, alignment } = m
        const propList = ['selection', 'lineWidth', 'lineType', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textFontSize', 'textColor']
        const assignment = { density, alignment }
        for (const prop of propList) {
            const realProp = {
                selection: 'selection',
                lineWidth: 'lineWidth',
                lineType: 'lineType',
                lineColor: 'lineColor',
                borderWidth: lm.selection === 's' ? 'sBorderWidth' : 'fBorderWidth',
                borderColor: lm.selection === 's' ? 'sBorderColor' : 'fBorderColor',
                fillColor: lm.selection === 's' ? 'sFillColor' : 'fFillColor',
                textFontSize: 'textFontSize',
                textColor: 'textColor',
                taskStatus: 'taskStatus'
            }[prop]
            if (selectionState.structSelectedPathList.map(el => (mapref(el))[realProp]).every((el, i, arr) => el  === arr[0])) {
                let propAssignment
                switch (prop) {
                    case 'selection': propAssignment = lm.selection; break
                    case 'lineWidth': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
                    case 'lineType': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
                    case 'lineColor': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
                    case 'borderWidth': propAssignment = lm.selection === 's' ? lm.sBorderWidth : lm.fBorderWidth; break
                    case 'borderColor': propAssignment = lm.selection === 's' ? lm.sBorderColor : lm.fBorderColor; break
                    case 'fillColor': propAssignment = lm.selection === 's' ? lm.sFillColor : lm.fFillColor; break
                    case 'textFontSize': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
                    case 'textColor': propAssignment = lm.selection === 's'? lm[prop] : mapGetProp.start(m, lm, prop); break
                    case 'taskStatus': propAssignment = lm.selection === 's'? lm[prop]: undefined; break
                }
                Object.assign(assignment, {[prop]: propAssignment})
            } else {
                Object.assign(assignment, {[prop]: undefined})
            }
        }
        yield put({ type: 'SET_NODE_PARAMS', payload: {node: assignment, nodeTriggersMap: false } })
        yield put({ type: 'SET_UNDO_DISABLED', payload: mapStack.dataIndex === 0})
        yield put({ type: 'SET_REDO_DISABLED', payload: mapStack.dataIndex === mapStack.data.length - 1})
    }
}

function* settingsSaga () {
    while (true) {
        yield take('OPEN_SETTINGS')
        const { resp: { error, data } } = yield call(fetchPost, { type: 'GET_NAME' })
        yield put({ type: 'SET_NAME', payload: data.name })
        yield put({ type: 'SHOW_WS_SETTINGS' })
        yield take(['CLOSE_SETTINGS'])
        yield put({ type: 'SHOW_WS' })
    }
}

function* frameSaga () {
    while (true) {
        const { type } = yield take([
            'OPEN_FRAME_EDITOR',
            'CLOSE_FRAME_EDITOR',
        ])
        switch (type) {
            case 'OPEN_FRAME_EDITOR':
                yield put({type: 'SET_FRAME_EDITOR_VISIBLE', payload: true})
                yield put({type: 'OPEN_FRAME'})
                break
            case 'CLOSE_FRAME_EDITOR':
                yield put({type: 'SET_FRAME_EDITOR_VISIBLE', payload: false})
                const breadcrumbMapNameList = yield select(state => state.breadcrumbMapNameList)
                yield put({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: breadcrumbMapNameList.length - 1}})
                break
        }
    }
}

function* shareSaga () {
    while (true) {
        let { type, payload } = yield take([
            'CREATE_SHARE'
        ])
        if (type === 'CREATE_SHARE') {
            const mapId = yield select(state => state.mapId)
            payload = {...payload, mapId }
        }
        yield put({type: 'INTERACTION_DISABLED'})
        const { resp: { error, data } } = yield call(fetchPost, { type, payload })
        yield put({type: 'INTERACTION_ENABLED'})
        if (error === 'createShareFailNotAValidUser') {
            yield put({ type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'There is no user associated with this address' })
        } else if (error === 'createShareFailCantShareWithYourself') {
            yield put({ type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'Please choose a different address than yours' })
        } else if (error === 'createShareFailAlreadyShared') {
            yield put({ type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'The map has already been shared' })
        } else {
            yield put({ type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'Share settings saved' })
        }
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: data })
    }
}

export default function* rootSaga () {
    yield all([
        authSaga(),
        colorSaga(),
        autoSaveSaga(),
        saveSaga(),
        mapSaga(),
        mapStackEventSaga(),
        mapStackSaga(),
        settingsSaga(),
        frameSaga(),
        shareSaga(),
        frameSaga(),
    ])
}
