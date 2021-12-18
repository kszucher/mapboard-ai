import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects'
import '@babel/polyfill'
import { initDomData } from './DomFlow'
import { mapDispatch, mapref, mapState, redraw, saveMap } from './MapFlow'
import { selectionState } from './SelectionFlow'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8082/beta'
    : 'https://mapboard-server.herokuapp.com/beta';

const fetchPost = (req) => {
    if (![
        'PING',
        'GET_LANDING_DATA',
        'SIGN_UP_STEP_1',
        'SIGN_UP_STEP_2'
    ].includes(req.type)) {
        req = {...req, cred: JSON.parse(localStorage.getItem('cred'))}
    }
    return fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(req),
    }).then(resp => resp.json())
}

function* legacySaga () {
    while (true) {
        let { type, payload } = yield take('*')
        console.log(type)
        let fetchGen = []
        switch (type) {
            case 'PING':                        fetchGen = [0, 0];   break
            case 'SIGN_IN':                     fetchGen = [0, 0];   break
            case 'OPEN_MAP_FROM_HISTORY':       fetchGen = [0, 0];   break
            case 'SIGN_UP_STEP_1':              fetchGen = [0, 0];   break
            case 'SIGN_UP_STEP_2':              fetchGen = [0, 0];   break
            case 'OPEN_MAP_FROM_TAB':           fetchGen = [1, 1];   break
            case 'OPEN_MAP_FROM_MAP':           fetchGen = [1, 0];   break
            case 'OPEN_MAP_FROM_BREADCRUMBS':   fetchGen = [1, 0];   break
            case 'SAVE_MAP':                    fetchGen = [1, 0];   break
            case 'CREATE_MAP_IN_MAP':           fetchGen = [1, 0];   break
            case 'CREATE_MAP_IN_TAB':           fetchGen = [1, 1];   break
            case 'REMOVE_MAP_IN_TAB':           fetchGen = [0, 1];   break
            case 'MOVE_UP_MAP_IN_TAB':          fetchGen = [0, 1];   break
            case 'MOVE_DOWN_MAP_IN_TAB':        fetchGen = [0, 1];   break
            case 'OPEN_FRAME':                  fetchGen = [1, 0];   break
            case 'IMPORT_FRAME':                fetchGen = [1, 0];   break
            case 'DUPLICATE_FRAME':             fetchGen = [1, 0];   break
            case 'DELETE_FRAME':                fetchGen = [0, 0];   break
            case 'PREV_FRAME':                  fetchGen = [1, 0];   break
            case 'NEXT_FRAME':                  fetchGen = [1, 0];   break
            case 'GET_SHARES':                  fetchGen = [0, 0];   break
            case 'CREATE_SHARE':                fetchGen = [0, 0];   break
            case 'ACCEPT_SHARE':                fetchGen = [0, 0];   break
            case 'DELETE_SHARE':                fetchGen = [0, 0];   break
            default: return
        }
        const [shouldSaveCurrentMap, shouldSynchTabs] = fetchGen
        if (shouldSaveCurrentMap) {
            payload = {...payload,
                mapIdOut: mapState.mapId,
                mapSourceOut: mapState.mapSource,
                mapStorageOut: saveMap(),
                frameSelectedOut: mapState.frameSelected
            }
        }
        if (shouldSynchTabs) {
            payload = {...payload,
                // tabMapIdListOut: state.tabMapIdList // TODO use
            }
        }
        if (type === 'OPEN_MAP_FROM_TAB') {
            yield put ({type: 'SET_TAB_MAP_SELECTED', payload})
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
        if (resp.type) {
            switch (resp.type) {
                case 'pingSuccess': {
                    const cred = JSON.parse(localStorage.getItem('cred'));
                    if (cred && cred.email && cred.password) {
                        localStorage.setItem('cred', JSON.stringify(cred))
                        yield put({type: 'SIGN_IN'})
                    }
                    break;
                }
                case 'signInSuccess': {
                    initDomData();

                    yield put({type: 'SHOW_WS'});

                    // remove double BE call here that came from useEffect on SHOW_WS,
                    // instead, after sign in successs, IMMEDIATELY load appropriate map on be !!!!

                    break;
                }
                case 'authFail': {
                    localStorage.clear();
                    break;
                }
            }
        }
        // TODO erre az egészre egy spread-es NAGY reducer-t tuti hogy ki lehet találni!!!
        if (resp.payload) {
            if (resp.payload.hasOwnProperty('landingData') &&
                resp.payload.hasOwnProperty('mapRight')) {
                const {landingData, mapRight} = resp.payload;
                initDomData();
                yield put({type: 'SET_LANDING_DATA', payload: {landingData, mapRight}})
            }
            if (resp.payload.hasOwnProperty('mapId') &&
                resp.payload.hasOwnProperty('mapSource') &&
                resp.payload.hasOwnProperty('mapStorage') &&
                resp.payload.hasOwnProperty('mapRight')) {
                const {mapId, mapSource, mapStorage, mapRight} = resp.payload;
                const frameSelected = resp.payload.hasOwnProperty('frameSelected') ? resp.payload.frameSelected : 0;
                yield put({type: 'AFTER_OPEN', payload: {mapSource, mapRight}})
                // this should be a useEffect!!!
                mapDispatch('initMapState', {mapId, mapSource, mapStorage, frameSelected});
                redraw();
            }
            if (resp.payload.hasOwnProperty('frameLen') &&
                resp.payload.hasOwnProperty('frameSelected')) {
                const {frameLen, frameSelected} = resp.payload;
                yield put({type: 'SET_FRAME_INFO', payload: {frameLen, frameSelected}})
            }
            if (resp.payload.hasOwnProperty('breadcrumbMapNameList')) {
                const {breadcrumbMapNameList} = resp.payload;
                yield put({type: 'SET_BREADCRUMB_DATA', payload: {breadcrumbMapNameList}})
            }
            if (resp.payload.hasOwnProperty('tabMapNameList') &&
                resp.payload.hasOwnProperty('tabMapSelected')) {
                const {tabMapNameList, tabMapSelected} = resp.payload;
                yield put({type: 'SET_TAB_DATA', payload: {tabMapNameList, tabMapSelected}})
            }
            if (resp.payload.hasOwnProperty('shareDataExport') &&
                resp.payload.hasOwnProperty('shareDataImport')) {
                const {shareDataExport, shareDataImport} = resp.payload;
                yield put({type: 'SET_SHARE_DATA', payload: {shareDataExport, shareDataImport}})
            }
            // TODO: az auth message válaszokra kitalálni valamit
        }
    }
}

function* playbackSaga () {
    // TODO create and open modal which checks if there is a frame already
}

function* authSaga () {
    // TODO: this will make logic in auth obsolete,
    // also, since ALL state will be brought to central state, this can control everything from here!!!
}

function* profileSaga () {
    while (true) {
        yield take('OPEN_PROFILE')
        const { name } = yield call(fetchPost, { type: 'GET_PROFILE_INFO' })
        yield put({ type: 'SET_PROFILE_NAME', payload: name })
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

function* wsSaga () {
    while (true) {
        yield take([
            'CLOSE_SHARES',
            'CLOSE_SHARING',
        ])
        yield put({type: 'SHOW_WS'})
    }
}

function* demoSaga () {
    while (true) {
        yield take([
            'LIVE_DEMO',
        ])
        const { resp } = yield call(fetchPost, { type: 'GET_LANDING_DATA' })
        yield put({ type: 'SHOW_DEMO' })
        console.log(resp)

        // TODO start here!!! make the universal parse, and move everything inside it to an appropriate side effect!!! this will be super cool
        // yield put({ type: 'PARSE_BE', payload: resp })
    }
}

export default function* rootSaga () {
    yield all([
        legacySaga(),
        playbackSaga(),
        profileSaga(),
        wsSaga(),
        demoSaga(),
    ])
}
