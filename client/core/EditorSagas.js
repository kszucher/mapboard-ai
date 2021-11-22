import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';

function* myFirstSaga() {

}

function* mySecondSaga() {

}

export default function* rootSaga() {
    yield all([
        myFirstSaga(),
        mySecondSaga()
    ])
}
