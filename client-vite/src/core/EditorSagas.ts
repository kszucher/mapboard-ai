// @ts-nocheck

import {all, call, delay, put, race, select, take} from 'redux-saga/effects'
import {initDomData} from './DomFlow'
import {actions, sagaActions} from "./EditorFlow";
import {PageState} from "./Types";
import {getMapData, getSavedMapData} from "./MapFlow";

const SAVE_INCLUDED = [
  'OPEN_MAP_FROM_TAB',
  'OPEN_MAP_FROM_BREADCRUMBS',
  'OPEN_MAP_FROM_MAP',
  'CREATE_MAP_IN_MAP',
  'CREATE_MAP_IN_TAB',
  'OPEN_FRAME',
  'CLOSE_FRAME',
  'IMPORT_FRAME',
  'DUPLICATE_FRAME',
  'OPEN_PREV_FRAME',
  'OPEN_NEXT_FRAME'
]

const SAVE_NOT_INCLUDED = [
  'REMOVE_MAP_IN_TAB',
  'MOVE_UP_MAP_IN_TAB',
  'MOVE_DOWN_MAP_IN_TAB',
  'DELETE_FRAME',
]

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta';

const fetchPost = (req) => {
  if ([
    'SIGN_IN',
    'SIGN_UP_STEP_1',
    'SIGN_UP_STEP_2',
    'LIVE_DEMO'
  ].includes(req.type)) {
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

function* serverCallSaga({ type, payload }) {
  yield put(actions.interactionDisabled())
  const { resp: { error, data } } = yield call(fetchPost, { type, payload })
  yield put(actions.interactionEnabled())
  if (error === 'authFailWrongCred') {
    yield put(actions.setAuthFeedbackMessage('Authentication failed, wrong credentials'))
    localStorage.clear()
  } else if (error === 'authFailIncompleteRegistration') {
    yield put(actions.setAuthFeedbackMessage('Authentication failed, incomplete registration'))
  } else if (error === 'signUpStep1FailAlreadyAwaitingConfirmation') {
    yield put(actions.setAuthFeedbackMessage('Already awaiting confirmation'))
  } else if (error === 'signUpStep1FailAlreadyConfirmed') {
    yield put(actions.setAuthFeedbackMessage('Already confirmed'))
  } else if (error === 'signUpStep2FailWrongEmailOrConfirmationCode') {
    yield put(actions.setAuthFeedbackMessage('Wrong email or confirmation code'))
  } else if (error === 'signUpStep2FailAlreadyActivated') {
    yield put(actions.setAuthFeedbackMessage('Already activated'))
  }
  // cant put parse here, but can put all error here
  return { error, data }
}

function* authSaga () {
  while (true) {
    const { type, payload } = yield take([
      'LIVE_DEMO',
      'SIGN_UP_STEP_1',
      'SIGN_UP_STEP_2',
      'SIGN_IN',
      'CHECK_SET_CONFIRMATION_CODE',
    ])
    if (type === 'SIGN_IN' && (payload.cred.email === '' || payload.cred.password === '')) {
      yield put(actions.setAuthFeedbackMessage('Missing information'))
    } else if (type === 'SIGN_IN' && payload.cred.password.length < 5) {
      yield put(actions.setAuthFeedbackMessage('Too short password'))
    } else if (type === 'SIGN_UP_STEP_1' && payload.cred.password.length < 5 ) {
      yield put(actions.setAuthFeedbackMessage('Your password must be at least 5 characters'))
    } else if (type === 'CHECK_SET_CONFIRMATION_CODE' && !isNaN(payload) && payload.length <= 4) {
      yield put(actions.setConfirmationCode(payload))
      yield put(actions.setAuthFeedbackMessage(''))
    } else if (type === 'CHECK_SET_CONFIRMATION_CODE') {
      yield put(actions.setAuthFeedbackMessage('Invalid character'))
    } else {
      const { error, data } = yield call(serverCallSaga, { type, payload })
      if (error === '') {
        if (type === 'LIVE_DEMO') {
          initDomData()
          yield put(actions.setPageState(PageState.DEMO))
        } else if (type === 'SIGN_UP_STEP_1') {
          yield put(actions.signUpStep2Panel())
        } else if (type === 'SIGN_UP_STEP_2') {
          yield put(actions.signInPanel())
        } else if (type === 'SIGN_IN') {
          const {cred} = data
          localStorage.setItem('cred', JSON.stringify(cred))
          initDomData()
          yield put(actions.setPageState(PageState.WS))
        }
        yield put(actions.parseRespPayload(data))
      }
    }
  }
}

function* colorSaga () {
  while (true) {
    yield take('TOGGLE_COLOR_MODE')
    const colorMode = (yield select(state => state.colorMode))
    yield put(actions.interactionDisabled())
    const { resp: { error, data } } = yield call(fetchPost, { type: 'TOGGLE_COLOR_MODE', payload: { colorMode } })
    yield put(actions.interactionEnabled())
    yield put(actions.parseRespPayload(data))
  }
}

const AUTO_SAVE_STATES = {WAIT: 'WAIT', IDLE: 'IDLE'}
let autoSaveState = AUTO_SAVE_STATES.IDLE
function* autoSaveSaga() {
  while (true) {
    // TODO: only do ANYTHING if mapRight === EDIT
    const { autoSaveNow, autoSaveLater, autoSaveNowByTimeout } = yield race({
      autoSaveNow: take(SAVE_INCLUDED),
      autoSaveLater: take(['MAP_CHANGED']),
      autoSaveNowByTimeout: delay(1000)
    })
    if (autoSaveNow) {
      autoSaveState = AUTO_SAVE_STATES.IDLE
    } else if (autoSaveLater) {
      autoSaveState = AUTO_SAVE_STATES.WAIT
    } else if (autoSaveNowByTimeout) {
      if (autoSaveState === AUTO_SAVE_STATES.WAIT) {
        autoSaveState = AUTO_SAVE_STATES.IDLE
        const mapStackData = yield select(state => state.mapStackData)
        const mapStackDataIndex = yield select(state => state.mapStackDataIndex)
        const m = mapStackData[mapStackDataIndex]
        if (mapStackData.length === 1 && mapStackDataIndex === 0 || mapStackData.length === 0) {
          console.log('skip save')
        } else {
          console.log('apply save')
          const mapId = yield select(state => state.mapId)
          const mapSource = yield select(state => state.mapSource)
          const mapData = getSavedMapData(m)
          const type = 'SAVE_MAP'
          const payload = { save: { mapId, mapSource, mapData } }
          yield put(actions.interactionDisabled())
          yield call(fetchPost, { type, payload })
          yield put(actions.interactionEnabled())
        }
      }
    }
  }
}

function* mapSaga () {
  while (true) {
    let { type, payload } = yield take(['SAVE_MAP', ...SAVE_INCLUDED, ...SAVE_NOT_INCLUDED])
    if (['SAVE_MAP', ...SAVE_INCLUDED].includes(type)) {
      const mapId = yield select(state => state.mapId)
      const mapSource = yield select(state => state.mapSource)
      const mapStackData = yield select(state => state.mapStackData)
      const mapStackDataIndex = yield select(state => state.mapStackDataIndex)
      const m = mapStackData[mapStackDataIndex]
      const mapData = getSavedMapData(m)
      payload = { ...payload, save: { mapId, mapSource, mapData } }
      switch (type) {
        case 'OPEN_MAP_FROM_TAB': {
          const {tabMapSelected} = payload
          const tabMapIdList = yield select(state => state.tabMapIdList)
          const mapId = tabMapIdList[tabMapSelected]
          payload = {...payload, mapId}
          break
        }
        case 'OPEN_MAP_FROM_BREADCRUMBS': {
          const {breadcrumbMapSelected} = payload
          const breadcrumbMapIdList = yield select(state => state.breadcrumbMapIdList)
          const mapId = breadcrumbMapIdList[breadcrumbMapSelected]
          payload = {...payload, mapId}
          break
        }
        case 'OPEN_MAP_FROM_MAP': {
          const {lastOverPath} = payload
          const ln = getMapData(m, lastOverPath)
          const mapId = ln.link
          payload = {...payload, mapId}
          break
        }
        case 'CREATE_MAP_IN_MAP': {
          const {lastPath} = m.g.sc
          payload = {...payload, lastPath, newMapName: getMapData(m, lastPath).content}
          break
        }
        case 'DUPLICATE_FRAME': {
          payload = {...payload, mapData: getSavedMapData()}
          break
        }
      }
    } else if ([...SAVE_NOT_INCLUDED].includes(type)) {
      const mapId = yield select(state => state.mapId)
      payload = { ...payload, mapId }
    }
    yield put(actions.interactionDisabled())
    const { resp: { error, data } } = yield call(fetchPost, { type, payload })
    yield put(actions.interactionEnabled())
    yield put(actions.parseRespPayload(data))
    if (type === 'CREATE_MAP_IN_MAP') {
      yield put(actions.setPageState(PageState.WS))
    }
  }
}

function* shareSaga () {
  while (true) {
    let { type, payload } = yield take([
      'GET_SHARES',
      'CREATE_SHARE',
      'ACCEPT_SHARE',
      'DELETE_SHARE',
    ])
    if (type === 'CREATE_SHARE') {
      const mapId = yield select(state => state.mapId)
      payload = {...payload, mapId }
    }
    yield put(actions.interactionDisabled())
    const { resp: { error, data } } = yield call(fetchPost, { type, payload })
    yield put(actions.interactionEnabled())
    switch (type) {
      case 'CREATE_SHARE':
        switch (error) {
          case 'createShareFailNotAValidUser':
            yield put(actions.setShareFeedbackMessage('There is no user associated with this address'))
            break
          case 'createShareFailCantShareWithYourself':
            yield put(actions.setShareFeedbackMessage('Please choose a different address than yours'))
            break
          case 'createShareFailAlreadyShared':
            yield put(actions.setShareFeedbackMessage('The map has already been shared'))
            break
          default:
            yield put(actions.setShareFeedbackMessage('Share settings saved'))
            break
        }
        break
    }
    yield put(actions.parseRespPayload(data))
  }
}

function* signOutSaga () {
  while (true) {
    yield take('SIGN_OUT')
    localStorage.setItem('cred', JSON.stringify({email: '', password: ''}))
    yield put(actions.resetState())
  }
}

function* deleteAccountSaga () {
  while (true) {
    const { type } = yield take('DELETE_ACCOUNT')
    yield call(fetchPost, { type })
    yield put(sagaActions.signOut())
  }
}

export default function* rootSaga () {
  yield all([
    authSaga(),
    colorSaga(),
    autoSaveSaga(),
    mapSaga(),
    shareSaga(),
    signOutSaga(),
    deleteAccountSaga(),
  ])
}
