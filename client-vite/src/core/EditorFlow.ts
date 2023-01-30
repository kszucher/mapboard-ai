import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FormatMode, AccessTypes, PageState} from "./Types";
import {mapAssembly} from "../map/MapAssembly";
import {getMapData, getSavedMapData, reCalc} from "./MapFlow";
import {mapDeInit} from "../map/MapDeInit";
import {copy} from "./Utils";
import {api} from "./Api";
import {initDomData} from "./DomFlow";

interface EditorState {
  token: string,
  pageState: PageState,
  formatMode: FormatMode,
  tabShrink: boolean,
  tempMap: object,
  mapStackData: [],
  mapStackDataIndex: number,
  editedNodeId: string,
  moveTarget: [],
  selectTarget: [],
  formatterVisible: boolean,
  moreMenu: boolean,
  // query // REMOVE for real, SSR wins
  mapId: string,
  dataFrameSelected: number,
  breadcrumbMapIdList: [],
  tabMapIdList: [],
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
  // query // REMOVE for real, SSR wins
  mapId: '',
  dataFrameSelected: 0,
  breadcrumbMapIdList: [],
  tabMapIdList: [],
}

export interface DefaultUseOpenWorkspaceQueryState {
  name: string,
  colorMode: string,
  mapId: string,
  mapDataList: [],
  dataFramesLen: number,
  dataFrameSelected: number,
  access: AccessTypes,
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  tabMapSelected: number,
}

export const defaultUseOpenWorkspaceQueryState : DefaultUseOpenWorkspaceQueryState = {
  name: '',
  colorMode: 'dark',
  mapId: '',
  mapDataList: [],
  dataFramesLen: 0,
  dataFrameSelected: -1,
  access: AccessTypes.UNAUTHORIZED,
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  tabMapSelected: 0,
}

const editorStateDefault = JSON.stringify(editorState)

export const getEditedNodeId = () => (store.getState().editor.editedNodeId)
export const getMoveTarget = () => (store.getState().editor.moveTarget)
export const getSelectTarget = () => (store.getState().editor.selectTarget)
export const getTempMap = () => (store.getState().editor.tempMap)
export const getMap = () : { g: any, r: any } => (store.getState().editor.mapStackData[store.getState().editor.mapStackDataIndex])
export const getMapId = () => {
  const { mapId } = store.getState().editor
  return { mapId }
}
export const getSaveMapProps = () => {
  const { mapId, dataFrameSelected } = store.getState().editor
  const m = getMap()
  const mapData = getSavedMapData(m)
  return { mapId, dataFrameSelected, mapData }
}
export const getCreateMapProps = () : { mapId: string, nodeId: string, content: string }  => {
  const { mapId } = store.getState().editor
  const m = getMap()
  const { lastPath } = m.g.sc
  const last = getMapData(m, lastPath)
  return { mapId, nodeId: last.nodeId, content: last.content }
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
        initDomData()
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      api.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        const { mapId, dataFrameSelected, breadcrumbMapIdList, tabMapIdList, mapDataList } = payload
        state.mapStackData = mapDataList.map((el: any) => reCalc(mapAssembly(el), mapAssembly(el))) as []
        state.mapStackDataIndex = 0
        state.editedNodeId = ''
        state.pageState = PageState.WS
        // query
        state.mapId = mapId
        state.dataFrameSelected = dataFrameSelected
        state.breadcrumbMapIdList = breadcrumbMapIdList
        state.tabMapIdList = tabMapIdList
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
