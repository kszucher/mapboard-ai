import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import '@babel/polyfill'

function* myFirstSaga() {

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
