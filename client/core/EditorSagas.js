import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects';
import '@babel/polyfill'
import { initDomData } from './DomFlow'
import { mapDispatch, redraw } from './MapFlow'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const fetchPost = req => {
  return fetch(`${apiUrl}/${'cica'}`, {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(req),
  }).then(resp => resp.json())
}

const openMapFromTab = payload => fetchPost({serverCmd: 'openMapFromTab', payload})

function* myFirstSaga() {
  while(true) {
    yield take('SIGN_IN')
    yield put({type: 'SIGN_IN_REAL'})

    // instead of PUT, we could call directly the signIn endpoint, OR the /beta endpoint with the appropriate req
    // once that call returns, based on what we find, we could handle things here
    //             case 'signUpStep1FailEmailAlreadyInUse':    setFeedbackMessage('Email address already in use.'); break;
    //             case 'signUpStep1Success':                  switchSubMode(subTabValues[1]); break;

    // THEN we could yield again STEP 2

    //             case 'signUpStep2FailUnknownUser':          setFeedbackMessage('Unknown User.'); break;
    //             case 'signUpStep2FailWrongCode':            setFeedbackMessage('Wrong code.'); break;
    //             case 'signUpStep2FailAlreadyActivated':     setFeedbackMessage('Already activated.'); break;
    //             case 'signUpStep2Success':                  switchMainMode(mainTabValues[0]); setEmail(regEmail); setPassword(regPassword); break;

    // THIS seems simple...
    // TODO: try to think through the OPEN PLAYBACK EDITOR flow, including the stupid useEffect steps in FrameSide,
    // how would that look like using sagas instead,
    // especially adding that we should also include a check before showing anything
  }
}


function* doSomething({payload}) {
  // console.log('this Run')
  console.log('LEFF')

}

function* mySecondSaga() {
  while (true) {
     const {type} = yield take(
      [ // maybe we will just fork a loader individually, and this is a dead end
      // by the way, the amount of sagas may be less then the fetch endpoints, IF some action can only follow another
      'OPEN_MAP_FROM_TAB',
      'CREATE_MAP_IN_TAB',
      'REMOVE_MAP_IN_TAB',
      'MOVE_UP_MAP_IN_TAB',
      'MOVE_DOWN_MAP_IN_TAB'
      ]
    )
    console.log('group found.. <-----------------------')
    console.log(type) // --> THIS IS HOW THIS IS ACCESSED AND CAN BE MOVED FORWARD!!!!
    // yield call save service
  }
}



function* myThirdSaga() {
  while (true) {
    const {payload} = yield take('OPEN_MAP_FROM_TAB');
    const resp = yield call(openMapFromTab, payload)
    yield fork(respParser, resp)
  }
}

function* respParser(resp) {
  const serverState = serverResponse.payload;
  if (serverState.hasOwnProperty('landingData') &&
    serverState.hasOwnProperty('mapRight')) {
    const {landingData, mapRight} = serverState;
    initDomData();
    dispatch({type: 'SET_LANDING_DATA', payload: {landingData, mapRight}})
  }
  if (serverState.hasOwnProperty('mapId') &&
    serverState.hasOwnProperty('mapSource') &&
    serverState.hasOwnProperty('mapStorage') &&
    serverState.hasOwnProperty('mapRight')) {
    const {mapId, mapSource, mapStorage, mapRight} = serverState;
    let frameSelected = serverState.hasOwnProperty('frameSelected') ? serverState.frameSelected : 0;
    dispatch({type: 'AFTER_OPEN', payload: {mapSource, mapRight}})
    mapDispatch('initMapState', {mapId, mapSource, mapStorage, frameSelected});
    redraw();
  }
  if (serverState.hasOwnProperty('frameLen') &&
    serverState.hasOwnProperty('frameSelected')) {
    const {frameLen, frameSelected} = serverState;
    dispatch({type: 'SET_FRAME_INFO', payload: {frameLen, frameSelected}})
  }
  if (serverState.hasOwnProperty('breadcrumbMapNameList')) {
    const {breadcrumbMapNameList} = serverState;
    dispatch({type: 'SET_BREADCRUMB_DATA', payload: {breadcrumbMapNameList}})
  }
  if (serverState.hasOwnProperty('tabMapNameList') &&
    serverState.hasOwnProperty('tabMapSelected')) {
    const {tabMapNameList, tabMapSelected} = serverState;
    dispatch({type: 'SET_TAB_DATA', payload: {tabMapNameList, tabMapSelected}})
  }
  if (serverState.hasOwnProperty('shareDataExport') &&
    serverState.hasOwnProperty('shareDataImport')) {
    const {shareDataExport, shareDataImport} = serverState;
    dispatch({type: 'SET_SHARE_DATA', payload: {shareDataExport, shareDataImport}})
  }
}
// TABLOADER?
// BREADCRUMBLOADER?

// everything will fall into their place

// TODO will need to transform BE to support these micro services, but we are starting to get the feel of this!!!

export default function* rootSaga() {
  yield all([
    myFirstSaga(),
    mySecondSaga(),
    // myThirdSaga()
  ])
}

// REAL THING --> saga will be good for ONE thing really, which is essentially REAL TIME COLLABORATION
