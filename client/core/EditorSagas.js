import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects';
import '@babel/polyfill'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

function* myFirstSaga() {
    while(true) {
        yield take('SIGN_IN')
        yield put({type: 'SIGN_IN_REAL'})
    }
}

function* mySecondSaga() {
    console.log('reached...')
}

export default function* rootSaga() {
    yield all([
        myFirstSaga(),
        mySecondSaga()
    ])
}
