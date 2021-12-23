import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects'
import '@babel/polyfill'
import { initDomData } from './DomFlow'
import { mapref, mapState, saveMap } from './MapFlow'
import { selectionState } from './SelectionFlow'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8082/beta'
    : 'https://mapboard-server.herokuapp.com/beta';

const fetchPost = (req) => {
    if (['SIGN_IN', 'SIGN_UP_STEP_1', 'SIGN_UP_STEP_2', 'LIVE_DEMO'].includes(req.type)) {
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

function* legacySaga (task) {
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
            'CREATE_SHARE',
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
            payload = {...payload,
                mapIdOut: mapState.mapId,
                mapSourceOut: mapState.mapSource,
                mapStorageOut: saveMap(),
                frameSelectedOut: mapState.frameSelected
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
            payload = { ...payload,
                mapIdDelete: mapState.mapId,
                frameSelectedOut: mapState.frameSelected
            }
        }
        if (type === 'CREATE_SHARE') {
            payload = {...payload,
                mapId: mapState.mapId,
            }
        }
        const { resp } = yield call(fetchPost, { type, payload })
        yield put({ type: 'PARSE_RESP_PAYLOAD', payload: resp.payload })
    }
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
                yield put({type: 'SET_FEEDBACK_MESSAGE', payload: 'Email address already in use'})
                break
            case 'signUpStep1Success':
                yield put({type: 'SIGN_UP_STEP_2_PANEL'})
                break
            case 'signUpStep2FailUnknownUser':
                yield put({type: 'SET_FEEDBACK_MESSAGE', payload: 'Unknown user'})
                break
            case 'signUpStep2FailWrongCode':
                yield put({type: 'SET_FEEDBACK_MESSAGE', payload: 'Wrong code'})
                break
            case 'signUpStep2FailAlreadyActivated':
                yield put({type: 'SET_FEEDBACK_MESSAGE', payload: 'Already activated'})
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

function* wsSaga () {
    while (true) {
        yield take([
            'CLOSE_SHARES',
            'CLOSE_SHARING',
        ])
        yield put({type: 'SHOW_WS'})
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

function* playbackSaga () {
    // TODO create and open modal which checks if there is a frame already
}

export default function* rootSaga () {
    yield all([
        authSaga(),
        legacySaga(),
        playbackSaga(),
        profileSaga(),
        wsSaga(),
    ])
}
