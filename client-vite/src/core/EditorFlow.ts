import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AccessTypes, FormatMode, PageState} from "./Enums"
import {getMapData, mapReducer} from "./MapFlow"
import {mapDeInit} from "../map/MapDeInit"
import {api} from "./Api"
import {DefaultUseOpenWorkspaceQueryState, EditorState} from "../types/EditorFlow"
import {mapAssembly} from "../map/MapAssembly"
import {M} from "../state/MTypes"

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
  moveCoords: [],
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

export const getMap = () => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
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
    mapAction(state, action: PayloadAction<{ type: string, payload: any }>) {
      const m = state.mapList[state.mapListIndex]
      if (action.payload.type === 'startEditReplace') {
        state.editedNodeId = findEditedNodeId(mapAssembly(m) as M)
        state.editType = 'replace'
      } else {
        const nm = mapReducer(m, action.payload.type, action.payload.payload)
        const isMapChanged =
          JSON.stringify(mapDeInit.start(mapAssembly(m) as M)) !==
          JSON.stringify(mapDeInit.start(mapAssembly(nm) as M))
        switch (action.payload.type) {
          case 'startEditAppend':
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = nm
            state.editedNodeId = findEditedNodeId(mapAssembly(m) as M)
            state.editType = 'append'
            break
          case 'typeText':
            state.tempMap = nm
            break;
          case 'finishEdit':
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = {}
            state.editedNodeId = ''
            state.editType = ''
            break
          default:
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = {}
            break
        }
      }
    },
    undo(state) {
      state.mapListIndex = state.mapListIndex > 0 ? state.mapListIndex - 1 : state.mapListIndex
      state.editedNodeId = ''
    },
    redo(state) {
      state.mapListIndex = state.mapListIndex < state.mapList.length - 1 ? state.mapListIndex + 1 : state.mapListIndex
      state.editedNodeId = ''
    },
    setFromCoordsMove(state, action: PayloadAction<any>) {state.moveCoords = action.payload},
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
        state.mapList = mapDataList.map((el) => mapReducer(el, '', {}))
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
