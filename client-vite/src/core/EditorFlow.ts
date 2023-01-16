import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
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
  dataFrameSelected: number,
  breadcrumbMapIdList: [],
  tempMap: object,
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

const editorState : EditorState = {
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
  dataFrameSelected: 0,
  breadcrumbMapIdList: [],
  tempMap: {},
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
}

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

export const editorSlice = createSlice({
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

export const { actions, reducer } = editorSlice

export const store = configureStore({
  reducer: combineReducers({api: api.reducer, editor: editorSlice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
