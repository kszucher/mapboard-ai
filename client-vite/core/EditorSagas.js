import { all, call, put, select, take } from 'redux-saga/effects'
import { initDomData } from './DomFlow'
import { mapref, mapStack, mapStackDispatch, saveMap } from './MapStackFlow'
import { selectionState } from './SelectionFlow'
import { redraw } from './MapFlow'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

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
            'SIGN_IN',
            'SIGN_UP_STEP_1',
            'SIGN_UP_STEP_2',
            'LIVE_DEMO',
        ])
        const { resp } = yield call(fetchPost, { type, payload })
        switch (resp.type) {
            case 'signInSuccess':
                const { cred } = resp.payload
                localStorage.setItem('cred', JSON.stringify(cred))
                initDomData()
                yield put({type: 'SHOW_WS'})
                break
            case 'signInFailWrongCred':
                localStorage.clear();
                break
            case 'signInFailIncompleteRegistration':
                console.log('incomplete registration')
                break
            case 'signUpStep1FailEmailAlreadyInUse':
                yield put({type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Email address already in use'})
                break
            case 'signUpStep1Success':
                yield put({type: 'SIGN_UP_STEP_2_PANEL'})
                break
            case 'signUpStep2FailUnknownUser':
                yield put({type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Unknown user'})
                break
            case 'signUpStep2FailWrongCode':
                yield put({type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Wrong code'})
                break
            case 'signUpStep2FailAlreadyActivated':
                yield put({type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: 'Already activated'})
                break
            case 'signUpStep2Success':
                yield put({type: 'SIGN_IN_PANEL'})
                break
            case 'liveDemoSuccess':
                initDomData()
                yield put({type: 'SHOW_DEMO'})
                break
        }
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: resp.payload })
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

function* mapSaga () {
    while (true) {
        let { type, payload } = yield take([
            'OPEN_MAP_FROM_TAB',
            'OPEN_MAP_FROM_MAP',
            'OPEN_MAP_FROM_BREADCRUMBS',
            'SAVE_MAP',
            'CREATE_MAP_IN_MAP',
            'CREATE_MAP_IN_TAB',
            'REMOVE_MAP_IN_TAB',
            'MOVE_UP_MAP_IN_TAB',
            'MOVE_DOWN_MAP_IN_TAB',
            'OPEN_FRAME',
            'IMPORT_FRAME',
            'DUPLICATE_FRAME',
            'DELETE_FRAME',
            'OPEN_PREV_FRAME',
            'OPEN_NEXT_FRAME',
            'GET_SHARES',
            'ACCEPT_SHARE',
            'DELETE_SHARE',
        ])
        if ([
            'OPEN_MAP_FROM_TAB',
            'OPEN_MAP_FROM_MAP',
            'OPEN_MAP_FROM_BREADCRUMBS',
            'SAVE_MAP',
            'CREATE_MAP_IN_MAP',
            'CREATE_MAP_IN_TAB',
            'OPEN_FRAME',
            'IMPORT_FRAME',
            'DUPLICATE_FRAME',
            'OPEN_PREV_FRAME',
            'OPEN_NEXT_FRAME'
        ].includes(type)) {
            const mapId = yield select(state => state.mapId)
            const mapSource = yield select(state => state.mapSource)
            const frameSelected = yield select(state => state.frameSelected)
            payload = {...payload,
                mapIdOut: mapId,
                mapSourceOut: mapSource,
                mapStorageOut: saveMap(),
                frameSelectedOut: frameSelected
            }
        }
        if (type === 'OPEN_MAP_FROM_TAB') {
            yield put({type: 'SET_TAB_MAP_SELECTED', payload})
        }
        if (type === 'CREATE_MAP_IN_MAP') {
            payload = {...payload,
                lastPath: selectionState.lastPath,
                newMapName: mapref(selectionState.lastPath).content
            }
        }
        if (type === 'DELETE_FRAME') {
            const mapId = yield select(state => state.mapId)
            const frameSelected = yield select(state => state.frameSelected)
            payload = { ...payload,
                mapIdDelete: mapId,
                frameSelectedOut: frameSelected
            }
        }
        const { resp } = yield call(fetchPost, { type, payload })
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: resp.payload })
    }
}

function* mapStackSaga () {
    while (true) {
        const { type } = yield take(['UNDO', 'REDO', 'MAP_STACK_CHANGED'])
        const colorMode = yield select(state => state.colorMode)
        switch (type) {
            case 'UNDO': {
                mapStackDispatch('undo')
                redraw(colorMode)
                break
            }
            case 'REDO': {
                mapStackDispatch('redo')
                redraw(colorMode)
                break
            }
        }
        let m = mapref(['m'])
        const lm = mapref(selectionState.lastPath)
        const { density, alignment } = m
        const propList = ['selection', 'lineWidth', 'lineType', 'lineColor', 'borderWidth', 'borderColor', 'fillColor', 'textFontSize', 'textColor', 'taskStatus']
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
                const propAssignment = {
                    selection: lm.selection,
                    lineWidth: lm.selection === 's' ? lm.lineWidth : undefined, // TODO gather recursively
                    lineType: lm.selection === 's' ? lm.lineType : undefined,
                    lineColor: lm.selection === 's' ? lm.lineColor : undefined,
                    borderWidth: lm.selection === 's' ? lm.sBorderWidth : lm.fBorderWidth,
                    borderColor: lm.selection === 's' ? lm.sBorderColor : lm.fBorderColor,
                    fillColor: lm.selection === 's' ? lm.sFillColor : lm.fFillColor,
                    textFontSize: lm.selection === 's' ? lm.textFontSize : undefined,
                    textColor: lm.selection === 's'? lm.textColor: undefined,
                    taskStatus: lm.selection === 's'? lm.taskStatus: undefined
                }[prop]
                Object.assign(assignment, {[prop]: propAssignment})
            } else {
                Object.assign(assignment, {[prop]: undefined})
            }
        }

        // console.log(assignment)

        yield put({ type: 'SET_NODE_PARAMS', payload: assignment })
        yield put({ type: 'SET_UNDO_DISABLED', payload: mapStack.dataIndex === 0})
        yield put({ type: 'SET_REDO_DISABLED', payload: mapStack.dataIndex === mapStack.data.length - 1})
    }
}

function* profileSaga () {
    while (true) {
        yield take('OPEN_PROFILE')
        const { resp } = yield call(fetchPost, { type: 'GET_NAME' })
        yield put({ type: 'SET_NAME', payload: resp.name })
        yield put({ type: 'SHOW_WS_PROFILE' })
        const { type } = yield take(['CLOSE_PROFILE'])
        switch (type) {
            case 'CLOSE_PROFILE':
                yield put({ type: 'SHOW_WS' })
                break;
            case 'OTHERSTUFF':
                break;
        }
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
                yield put({type: 'SET_FRAME_EDITOR_VISIBLE', payload: 1})
                yield put({type: 'OPEN_FRAME'})
                break
            case 'CLOSE_FRAME_EDITOR':
                yield put({type: 'SET_FRAME_EDITOR_VISIBLE', payload: 0})
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
            payload = {...payload,
                mapId: mapStack.mapId,
            }
        }
        const { resp } = yield call(fetchPost, { type, payload })
        switch (resp.type) {
            case 'createShareFailNotAValidUser':
                yield put({type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'There is no user associated with this address'})
                break
            case 'createShareFailCantShareWithYourself':
                yield put({type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'Please choose a different address than yours'})
                break
            case 'createShareSuccess':
                yield put({type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'The map has been shared successfully'})
                break
            case 'createShareFailAlreadyShared':
                yield put({type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'The map has already been shared'})
                break
            case 'updateShareSuccess':
                yield put({type: 'SET_SHARE_FEEDBACK_MESSAGE', payload: 'Access has changed successfully'})
                break
        }
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: resp.payload })
    }
}

export default function* rootSaga () {
    yield all([
        authSaga(),
        colorSaga(),
        mapSaga(),
        mapStackSaga(),
        profileSaga(),
        frameSaga(),
        shareSaga(),
    ])
}
