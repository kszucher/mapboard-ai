import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects';
import '@babel/polyfill'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const assignProps = () => {

}

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

function* mySecondSaga() {
    while (true) {
        yield take([ // maybe we will just fork a loader individually, and this is a dead end
          // by the way, the amount of sagas may be less then the fetch endpoints, IF some action can only follow another
          'OPEN_MAP_FROM_TAB',
          'CREATE_MAP_IN_TAB',
          'REMOVE_MAP_IN_TAB',
          'MOVE_UP_MAP_IN_TAB',
          'MOVE_DOWN_MAP_IN_TAB'
        ])
        console.log('group found.. <-----------------------')
      // yield call save service
    }
}

function* myThirdSaga() {
  while (true) {
    yield take('OPEN_MAP_FROM_TAB')
    console.log('item found.. <-----------------------')
    const { tabMapIdList, tabMapSelected, breadcrumbMapIdList, mapId, mapSource } = yield call('openMapFromTab')
    // PUT ACTION
    yield fork(mapLoaderSaga, mapId, mapSource)
    // yield call mapRight, mapStorage based on mapId and mapSource??? YES MICROSERVICES!!!
    // ALSO, this thing will be forked, so other sagas can refer to it as well so it i
  }
}

function* mapLoaderSaga(mapId, mapSource) {
  // {mapRight, mapStorage} = yield call getMap
  // PUT ACTION
}
// TABLOADER?
// BREADCRUMBLOADER?

// everything will fall into their place

// TODO will need to transform BE to support these micro services, but we are starting to get the feel of this!!!

export default function* rootSaga() {
    yield all([
        myFirstSaga(),
        mySecondSaga(),
        myThirdSaga()
    ])
}
