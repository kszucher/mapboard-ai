import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./EditorSagas";
import {AuthPageState, FormatMode, MapRight, PageState} from "./Types";
import {mapAssembly} from "../map/MapAssembly";
import {getMapData, getSavedMapData, reCalc} from "./MapFlow";
import {mapDeInit} from "../map/MapDeInit";
import {copy} from "./Utils";
import {api} from "./Api";
import {initDomData} from "./DomFlow";

interface EditorState {
  authPageState: AuthPageState,
  name: string,
  email: string,
  password: string,
  passwordAgain: string,
  confirmationCode: string,
  authFeedbackMessage: string,
  pageState: PageState,
  colorMode: string,
  formatMode: FormatMode,
  tabShrink: boolean,
  mapId: string,
  breadcrumbMapIdList: [],
  tempMap: object,
  dataFrameSelected: number,
  mapStackData: [],
  mapStackDataIndex: number,
  editedNodeId: string,
  moveTarget: [],
  selectTarget: [],
  formatterVisible: boolean,
  shareEmail: string,
  shareAccess: string,
  shareFeedbackMessage: string,
  shareDataExport: [],
  shareDataImport: [],
  moreMenu: boolean,
  interactionDisabled: boolean,
}

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
  tabShrink: false,
  mapId: '',
  breadcrumbMapIdList: [],
  tempMap: {},
  dataFrameSelected: 0,
  mapStackData: [],
  mapStackDataIndex: 0,
  editedNodeId: '',
  moveTarget: [],
  selectTarget: [],
  formatterVisible: false,
  shareEmail: '',
  shareAccess: 'view',
  shareFeedbackMessage: '',
  shareDataExport: [],
  shareDataImport: [],
  moreMenu: false,
  interactionDisabled: false,
} as EditorState

export const defaultUseOpenMapQueryState = {
  mapId: '',
  dataFrameSelected: -1,
  dataFramesLen: 0,
  mapRight: MapRight.UNAUTHORIZED,
  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
}

const editorStateDefault = JSON.stringify(editorState)

// https://stackoverflow.com/questions/61757815/access-redux-state-in-custom-hook
export const getEditedNodeId = () => (store.getState().editor.editedNodeId)
export const getMoveTarget = () => (store.getState().editor.moveTarget)
export const getSelectTarget = () => (store.getState().editor.selectTarget)
export const getTempMap = () => (store.getState().editor.tempMap)
export const getMap = () : { g: any, r: any } => (store.getState().editor.mapStackData[store.getState().editor.mapStackDataIndex])
export const getMapSaveProps = () => {
  const { mapId, dataFrameSelected } = store.getState().editor
  const m = getMap()
  const mapData = getSavedMapData(m)
  return { mapId, dataFrameSelected, mapData }
}
export const getMapCreationProps = () : { mapCreationProps: { content: string, nodeId: string } }  => {
  const m = getMap()
  const { lastPath } = m.g.sc
  const last = getMapData(m, lastPath)
  return { mapCreationProps: { content: last.content, nodeId: last.nodeId } }
}
export const getMapSelectProps = () => {
  return { mapId: store.getState().editor.breadcrumbMapIdList.at(-1) }
}

export const editor = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    resetState(state) {return JSON.parse(editorStateDefault)},
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
    setShareEmail(state, action: PayloadAction<string>) { state.shareEmail = action.payload },
    setShareAccess(state, action: PayloadAction<string>) { state.shareAccess = action.payload },
    setShareFeedbackMessage(state, action: PayloadAction<string>) { state.shareFeedbackMessage = action.payload },
    openMoreMenu(state, action: PayloadAction<boolean>) { state.moreMenu = action.payload },
    closeMoreMenu(state) { state.moreMenu = false },
    interactionEnabled(state) { state.interactionDisabled =  false },
    interactionDisabled(state) { state.interactionDisabled = true },
    mutateMapStack(state, action: PayloadAction<any>) {
      const m = state.mapStackData[state.mapStackDataIndex]
      if (
        JSON.stringify(mapDeInit.start(copy(m))) !==
        JSON.stringify(mapDeInit.start(copy(action.payload)))
      ) {
        state.mapStackData = [...state.mapStackData.slice(0, state.mapStackDataIndex + 1), action.payload] as any
        state.mapStackDataIndex = state.mapStackDataIndex + 1
      }
    },
    mutateTempMap(state, action: PayloadAction<any>) {state.tempMap = action.payload},
    setEditedNodeId(state, action: PayloadAction<any>) {state.editedNodeId = action.payload},
    setMoveTarget(state, action: PayloadAction<any>) {state.moveTarget = action.payload},
    setSelectTarget(state, action: PayloadAction<any>) {state.selectTarget = action.payload},
    undo(state) {
      state.mapStackDataIndex = state.mapStackDataIndex > 0 ? state.mapStackDataIndex - 1 : state.mapStackDataIndex
      state.editedNodeId = ''
    },
    redo(state) {
      state.mapStackDataIndex = state.mapStackDataIndex < state.mapStackData.length - 1 ? state.mapStackDataIndex + 1 : state.mapStackDataIndex
      state.editedNodeId = ''
    },
  },
  extraReducers: (builder) => {
    // builder.addMatcher(
    //   api.endpoints.liveDemo.matchFulfilled, // TODO make this using openMap... so there is no confusion where the data is coming from
    //   (state, { payload }) => {
    //     const { mapId, mapDataFrames, mapRight } = payload.resp.data
    //     state.mapId = mapId
    //     state.mapRight = mapRight
    //
    //     state.mapStackData = mapDataFrames.map((el: any) => reCalc(mapAssembly(el), mapAssembly(el)))
    //     state.mapStackDataIndex = 0
    //     state.editedNodeId = ''
    //   }
    // )
    builder.addMatcher(
      api.endpoints.signIn.matchFulfilled,
      (state, { payload }) => {
        const { cred } = payload.resp.data
        localStorage.setItem('cred', JSON.stringify(cred))
        initDomData()
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      api.endpoints.openMap.matchFulfilled,
      (state, { payload }) => {
        const { mapId, dataFrameSelected, breadcrumbMapIdList, mapDataList } = payload.resp.data
        state.mapId = mapId // needed for api call argument
        state.dataFrameSelected = dataFrameSelected // needed for api call argument
        state.breadcrumbMapIdList = breadcrumbMapIdList // needed for api call argument
        state.mapStackData = mapDataList.map((el: any) => reCalc(mapAssembly(el), mapAssembly(el)))
        state.mapStackDataIndex = 0
        state.editedNodeId = ''
      }
    )
  }
})

export const { actions, reducer } = editor

export const sagaActions = {
  // liveDemo: () => ({type: 'LIVE_DEMO'}),
  // signIn: (email: string, password: string) => ({type: 'SIGN_IN', payload: { cred: { email, password } }}),
  // signUpStep1: (name: string, email: string, password: string) => ({type: 'SIGN_UP_STEP_1', payload: { cred: { name, email, password } } }),
  // signUpStep2: (email: string, confirmationCode: string) => ({type: 'SIGN_UP_STEP_2', payload: { cred: { email, confirmationCode: parseInt(confirmationCode) } } }),
  // checkSetConfirmationCode: (value: string) => ({type: 'CHECK_SET_CONFIRMATION_CODE', payload: value}),
  // saveMap: () => ({type: 'SAVE_MAP'}),
  // openMapFromTab: (value: number) => ({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}}),
  // openMapFromBreadcrumbs: (index: number) => ({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}}),
  // openMapFromMap: (lastOverPath: []) => ({type: 'OPEN_MAP_FROM_MAP', payload: {lastOverPath}}),
  // createMapInMap: () => ({type: 'CREATE_MAP_IN_MAP'}),
  // createMapInTab: () => ({type: 'CREATE_MAP_IN_TAB'}),
  // removeMapInTab: () => ({type: 'REMOVE_MAP_IN_TAB'}),
  // moveUpMapInTab: () => ({type: 'MOVE_UP_MAP_IN_TAB'}),
  // moveDownMapInTab: () => ({type: 'MOVE_DOWN_MAP_IN_TAB'}),
  // openFrame: () => ({type: 'OPEN_FRAME'}),
  // closeFrame: () => ({type: 'CLOSE_FRAME'}),
  // openPrevFrame: () => ({type: 'OPEN_PREV_FRAME'}),
  // openNextFrame: () => ({type: 'OPEN_NEXT_FRAME'}),
  // importFrame: () => ({type: 'IMPORT_FRAME'}),
  // duplicateFrame: () => ({type: 'DUPLICATE_FRAME'}),
  // deleteFrame: () => ({type: 'DELETE_FRAME'}),
  // getShares: () => ({type: 'GET_SHARES'}),
  // createShare: (shareEmail: string, shareAccess: any) => ({type: 'CREATE_SHARE', payload: {shareEmail, shareAccess}}),
  // acceptShare: (_id: number) => ({type: 'ACCEPT_SHARE', payload: {shareId: _id}}),
  // deleteShare: (_id: number) => ({type: 'DELETE_SHARE', payload: {shareId: _id}}),
  // toggleColorMode: () => ({type: 'TOGGLE_COLOR_MODE'}),
  // changeTabWidth: () => ({type: 'CHANGE_TAB_WIDTH'}), // TODO
  // deleteAccount: () => ({type: 'DELETE_ACCOUNT'}),
  // signOut: () => ({type: 'SIGN_OUT'}),
  // mapChanged: () => ({type: 'MAP_CHANGED'}),
}

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: combineReducers({api: api.reducer, editor: editor.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .concat(api.middleware)
    .concat(sagaMiddleware)
})

export type RootState = ReturnType<typeof store.getState>

sagaMiddleware.run(rootSaga)
