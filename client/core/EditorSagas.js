import { call, put, take, takeEvery, takeLatest, all } from 'redux-saga/effects'
import '@babel/polyfill'
import { initDomData } from './DomFlow'
import { mapDispatch, redraw } from './MapFlow'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8082/beta'
    : 'https://mapboard-server.herokuapp.com/beta';

const fetchPost = req => {
    return fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            ...req,
            cred: JSON.parse(localStorage.getItem('cred'))
        }),
    }).then(resp => resp.json())
}

const getProfileInfo = payload => fetchPost({ serverCmd: 'getProfileInfo', payload })

function* profileSaga () {
    while (true) {
        yield take('OPEN_PROFILE')
        const { name } = yield call(getProfileInfo)
        yield put({ type: 'SET_PROFILE_NAME', payload: name })
        yield put({ type: 'SHOW_WS_PROFILE' })
    }
}

export default function* rootSaga () {
    yield all([
        profileSaga(),
    ])
}

// FURTHER advantage of NOT storing data in components: can set up their state BEFORE instantiating them...
