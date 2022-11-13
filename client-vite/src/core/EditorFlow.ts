// @ts-nocheck

import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./EditorSagas";
import {AuthPageState, FormatMode, MapRight, PageState} from "./Types";
import {mapAssembly} from "../map/MapAssembly";
import {reCalc} from "./MapFlow";

const editorState = {
  authPageState: AuthPageState.SIGN_IN,

  name: '',
  email: '',
  password: '',
  passwordAgain: '',
  confirmationCode: '',
  authFeedbackMessage: '',

  pageState: PageState.AUTH,

  colorMode: 'dark',

  formatMode: FormatMode.text,

  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [''],

  tabShrink: false,

  mapId: '',
  mapSource: '',
  frameLen: 0,
  frameSelected: 0,
  mapRight: MapRight.UNAUTHORIZED,

  mapStackData: [],
  mapStackDataIndex: 0,

  isEditing: false,

  formatterVisible: false,

  frameEditorVisible: false,

  shareEmail: '',
  shareAccess: 'view',
  shareFeedbackMessage: '',
  shareDataExport: [],
  shareDataImport: [],

  moreMenu: false,

  interactionDisabled: false,
}

const editorStateDefault = JSON.stringify(editorState)

const allSlice = createSlice({
  name: 'whatever',
  initialState: editorState,
  reducers: {
    resetState(state) {
      return JSON.parse(editorStateDefault)
    },

    signInPanel(state) {
      state.authPageState = AuthPageState.SIGN_IN
      state.authFeedbackMessage = ''
    },
    signUpPanel(state) {
      state.authPageState = AuthPageState.SIGN_UP_STEP_1
      state.name =''
      state.email = ''
      state.password = ''
      state.passwordAgain = ''
      state.authFeedbackMessage = ''
    },
    signUpStep1Panel(state) { state.authPageState = AuthPageState.SIGN_UP_STEP_1 },
    signUpStep2Panel(state) { state.authPageState = AuthPageState.SIGN_UP_STEP_2 },
    setName(state, action: PayloadAction<string>) { state.name = action.payload },
    setEmail(state, action: PayloadAction<string>) { state.email = action.payload},
    setPassword(state, action: PayloadAction<string>) { state.password = action.payload },
    setPasswordAgain(state, action: PayloadAction<string>) { state.passwordAgain = action.payload },
    setConfirmationCode(state, action: PayloadAction<string>) { state.confirmationCode = action.payload },
    setAuthFeedbackMessage(state, action: PayloadAction<string>) { state.authFeedbackMessage = action.payload },

    setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },

    setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
    toggleFormatterVisible(state) { state.formatterVisible = !state.formatterVisible },

    toggleTabShrink(state) { state.tabShrink = !state.tabShrink },

    startEdit(state) { state.isEditing = true },
    finishEdit(state) { state.isEditing = false },

    setShareEmail(state, action: PayloadAction<string>) { state.shareEmail = action.payload },
    setShareAccess(state, action: PayloadAction<string>) { state.shareAccess = action.payload },
    setShareFeedbackMessage(state, action: PayloadAction<string>) { state.shareFeedbackMessage = action.payload },

    openMoreMenu(state, action: PayloadAction<boolean>) { state.moreMenu = action.payload },
    closeMoreMenu(state) { state.moreMenu = false },

    interactionEnabled(state) { state.interactionDisabled =  false },
    interactionDisabled(state) { state.interactionDisabled = true },

    mutateMapStack(state, action: PayloadAction<any>) {
      state.mapStackData = [...state.mapStackData.slice(0, state.mapStackDataIndex + 1), action.payload]
      state.mapStackDataIndex = state.mapStackDataIndex + 1
    },

    undo(state) {
      state.mapStackDataIndex = state.mapStackDataIndex > 0 ? state.mapStackDataIndex - 1 : state.mapStackDataIndex
    },

    redo(state) {
      state.mapStackDataIndex = state.mapStackDataIndex < state.mapStackData.length - 1 ? state.mapStackDataIndex + 1 : state.mapStackDataIndex
    },

    parseRespPayload(state, action: PayloadAction<any>) {
      let parsed = {}
      if (action.payload.hasOwnProperty('mapData')) {
          parsed = {
            mapStackData: [reCalc(mapAssembly(action.payload.mapData))],
            mapStackDataIndex: 0,
          }
      }
      if (action.payload.hasOwnProperty('landingData')) { // TODO rename this to mapDataFrames, both FE and BE
        parsed = {
          mapStackData: action.payload.landingData.map(el => reCalc(mapAssembly(el))),
          mapStackDataIndex: 0,
        }
      }
      return { ...state, ...action.payload, ...parsed }
    },
  }
})

export const { actions, reducer } = allSlice

export const sagaActions = {
  liveDemo: () => ({type: 'LIVE_DEMO'}),
  signIn: (email: string, password: string) => ({type: 'SIGN_IN', payload: { cred: { email, password } }}),
  signUpStep1: (name: string, email: string, password: string) => ({type: 'SIGN_UP_STEP_1', payload: { cred: { name, email, password } } }),
  signUpStep2: (email: string, confirmationCode: string) => ({type: 'SIGN_UP_STEP_2', payload: { cred: { email, confirmationCode: parseInt(confirmationCode) } } }),
  checkSetConfirmationCode: (value: string) => ({type: 'CHECK_SET_CONFIRMATION_CODE', payload: value}),
  saveMap: () => ({type: 'SAVE_MAP'}),
  openMapFromTab: (value: number) => ({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}}),
  openMapFromBreadcrumbs: (index: number) => ({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}}),
  openMapFromMap: (lastOverPath: []) => ({type: 'OPEN_MAP_FROM_MAP', payload: {lastOverPath}}),
  createMapInMap: () => ({type: 'CREATE_MAP_IN_MAP'}),
  createMapInTab: () => ({type: 'CREATE_MAP_IN_TAB'}),
  removeMapInTab: () => ({type: 'REMOVE_MAP_IN_TAB'}),
  moveUpMapInTab: () => ({type: 'MOVE_UP_MAP_IN_TAB'}),
  moveDownMapInTab: () => ({type: 'MOVE_DOWN_MAP_IN_TAB'}),
  openFrame: () => ({type: 'OPEN_FRAME'}),
  closeFrame: () => ({type: 'CLOSE_FRAME'}),
  openPrevFrame: () => ({type: 'OPEN_PREV_FRAME'}),
  openNextFrame: () => ({type: 'OPEN_NEXT_FRAME'}),
  importFrame: () => ({type: 'IMPORT_FRAME'}),
  duplicateFrame: () => ({type: 'DUPLICATE_FRAME'}),
  deleteFrame: () => ({type: 'DELETE_FRAME'}),
  getShares: () => ({type: 'GET_SHARES'}),
  createShare: (shareEmail: string, shareAccess: any) => ({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}}),
  acceptShare: (_id: number) => ({type: 'ACCEPT_SHARE', payload: {shareId: _id}}),
  deleteShare: (_id: number) => ({type: 'DELETE_SHARE', payload: {shareId: _id}}),
  toggleColorMode: () => ({type: 'TOGGLE_COLOR_MODE'}),
  changeTabWidth: () => ({type: 'CHANGE_TAB_WIDTH'}), // TODO
  deleteAccount: () => ({type: 'DELETE_ACCOUNT'}),
  signOut: () => ({type: 'SIGN_OUT'}),
}

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware])
})

sagaMiddleware.run(rootSaga)
