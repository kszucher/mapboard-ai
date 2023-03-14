import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AccessTypes, FormatMode, PageState} from "./Enums"
import {mapAssembly} from "../map/MapAssembly"
import {getMapData, mapReducer, reCalc} from "./MapFlow"
import {mapDeInit} from "../map/MapDeInit"
import {copy} from "./Utils"
import {api} from "./Api"
import {DefaultUseOpenWorkspaceQueryState, EditorState} from "../types/EditorFlow";
import {M} from "../types/DefaultProps";

const editorState : EditorState = {
  token: '',
  pageState: PageState.AUTH,
  formatMode: FormatMode.text,
  tabShrink: false,
  tempMap: {},
  mapList: [],
  mapListIndex: 0,
  editedNodeId: '',
  editType: '',
  moveTarget: [],
  selectionRect: [],
  formatterVisible: false,
  moreMenu: false,
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
export const getTempMap = () => (store.getState().editor.tempMap)
export const getMap = () : { g: any, r: any } => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
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

const isMapChanged = (m: M, nm: M) =>
  JSON.stringify(mapDeInit.start(copy(m))) !==
  JSON.stringify(mapDeInit.start(copy(nm)))

const findEditedNodeId = (m: M) => (
  m.g.sc.scope === 'c'
    ? getMapData(m, m.g.sc.lastPath).s[0].nodeId
    : getMapData(m, m.g.sc.lastPath).nodeId
)

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
    startEditReplace(state) {
      const m = state.mapList[state.mapListIndex]
      state.editedNodeId = findEditedNodeId(m)
      state.editType = 'replace'
    },
    startEditAppend(state) {
      const m = state.mapList[state.mapListIndex]
      const nm = reCalc(m, mapReducer(copy(m), 'startEditAppend', {}))
      if (isMapChanged(m, nm)) {
        state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
        state.mapListIndex = state.mapListIndex + 1
      }
      state.tempMap = nm
      state.editedNodeId = findEditedNodeId(m)
      state.editType = 'append'
    },
    typeText(state, action: PayloadAction<any>) {
      const m = state.mapList[state.mapListIndex]
      state.tempMap = reCalc(m, mapReducer(copy(m), 'typeText', action.payload))
    },
    finishEdit(state, action: PayloadAction<any>) {
      const m = state.mapList[state.mapListIndex]
      const nm = reCalc(m, mapReducer(copy(m), 'finishEdit', action.payload))
      if (isMapChanged(m, nm)) {
        state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
        state.mapListIndex = state.mapListIndex + 1
      }
      state.tempMap = {}
      state.editedNodeId = ''
      state.editType = ''
    },
    genericMapAction(state, action: PayloadAction<any>) {
      const m = state.mapList[state.mapListIndex]
      const nm = reCalc(m, mapReducer(copy(m), action.payload.type, action.payload.payload))
      if (isMapChanged(m, nm)) {
        state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
        state.mapListIndex = state.mapListIndex + 1
      }
      state.tempMap = {}
    },
    setMoveTarget(state, action: PayloadAction<any>) {state.moveTarget = action.payload},
    setSelectionRect(state, action: PayloadAction<any>) {state.selectionRect = action.payload},
    undo(state) {
      state.mapListIndex = state.mapListIndex > 0 ? state.mapListIndex - 1 : state.mapListIndex
      state.editedNodeId = ''
    },
    redo(state) {
      state.mapListIndex = state.mapListIndex < state.mapList.length - 1 ? state.mapListIndex + 1 : state.mapListIndex
      state.editedNodeId = ''
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.signIn.matchFulfilled,
      (state) => {state.pageState = PageState.WS}
    )
    builder.addMatcher(
      api.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        const { mapDataList } = payload
        state.mapList = mapDataList.map((el: any) => reCalc(mapAssembly(el), mapAssembly(el))) as []
        state.mapListIndex = 0
        state.editedNodeId = ''
        state.pageState = PageState.WS
      }
    )
  }
})

export const { actions } = editorSlice

export const store = configureStore({
  reducer: combineReducers({api: api.reducer, editor: editorSlice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
