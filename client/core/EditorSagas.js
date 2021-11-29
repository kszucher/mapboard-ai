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
        yield take([
          'OPEN_MAP_FROM_TAB',
          'CREATE_MAP_IN_TAB',
          'REMOVE_MAP_IN_TAB',
          'MOVE_UP_MAP_IN_TAB',
          'MOVE_DOWN_MAP_IN_TAB'
        ])
        console.log('shall save... <-----------------------')
    }
}

export default function* rootSaga() {
    yield all([
        myFirstSaga(),
        mySecondSaga()
    ])
}
