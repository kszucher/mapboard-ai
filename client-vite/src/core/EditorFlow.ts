import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {FormatMode, AccessTypes, PageState} from "./Types"
import {mapAssembly} from "../map/MapAssembly"
import {reCalc} from "./MapFlow"
import {mapDeInit} from "../map/MapDeInit"
import {copy} from "./Utils"
import {api} from "./Api"
import {initDomData} from "./DomFlow"
import {M} from "../types/DefaultProps";

interface EditorState {
  token: string,
  pageState: PageState,
  formatMode: FormatMode,
  tabShrink: boolean,
  tempMap: object,
  mapStackData: M[],
  mapStackDataIndex: number,
  editedNodeId: string,
  moveTarget: [],
  selectTarget: [],
  formatterVisible: boolean,
  moreMenu: boolean,
}

const editorState : EditorState = {
  token: '',
  pageState: PageState.AUTH,
  formatMode: FormatMode.text,
  tabShrink: false,
  tempMap: {},
  mapStackData: [],
  mapStackDataIndex: 0,
  editedNodeId: '',
  moveTarget: [],
  selectTarget: [],
  formatterVisible: false,
  moreMenu: false,
}

export interface DefaultUseOpenWorkspaceQueryState {
  name: string,
  colorMode: string,
  access: AccessTypes,
  tabId: number,
  mapId: string,
  frameId: string,
  mapDataList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  frameIdList: string[],
}

export const defaultUseOpenWorkspaceQueryState : DefaultUseOpenWorkspaceQueryState = {
  name: '',
  colorMode: 'dark',
  access: AccessTypes.UNAUTHORIZED,
  tabId: 0,
  mapId: '',
  frameId: '',
  mapDataList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  frameIdList: []
}

const editorStateDefault = JSON.stringify(editorState)

export const getEditedNodeId = () => (store.getState().editor.editedNodeId)
export const getMoveTarget = () => (store.getState().editor.moveTarget)
export const getSelectTarget = () => (store.getState().editor.selectTarget)
export const getTempMap = () => (store.getState().editor.tempMap)
export const getMap = () : { g: any, r: any } => (store.getState().editor.mapStackData[store.getState().editor.mapStackDataIndex])
export const getMapId = () => {
  const result = api.endpoints.openWorkspace.select()(store.getState())
  const { data } = result
  const { mapId } = data || defaultUseOpenWorkspaceQueryState
  return mapId
}
export const getFrameId = () => {
  const result = api.endpoints.openWorkspace.select()(store.getState())
  const { data } = result
  const { frameId } = data || defaultUseOpenWorkspaceQueryState
  return frameId
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    setToken(state, action: PayloadAction<string>) { state.token = action.payload },
    resetState() {return JSON.parse(editorStateDefault)},
    setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },
    setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
    toggleFormatterVisible(state) { state.formatterVisible = !state.formatterVisible },
    toggleTabShrink(state) { state.tabShrink = !state.tabShrink },
    openMoreMenu(state, action: PayloadAction<boolean>) { state.moreMenu = action.payload },
    closeMoreMenu(state) { state.moreMenu = false },
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
    mutateTempMap(state, action: PayloadAction<any>) {
      state.tempMap = action.payload
    },
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
        initDomData()
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      api.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        const { mapDataList } = payload
        state.mapStackData = mapDataList.map((el: any) => reCalc(mapAssembly(el), mapAssembly(el))) as []
        state.mapStackDataIndex = 0
        state.editedNodeId = ''
        state.pageState = PageState.WS
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
