import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';


const initialState = {}

export const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case Posts.fetchPosts:
            // here we catch our payload data and pass it into the state of the store
            return {...state}
        default:
            return state
    }
}

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
