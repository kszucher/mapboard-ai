import {combineReducers, configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {mapReducer} from "../map/MapReducer"
import {mapAssembly} from "../map/MapAssembly"
import {mapDeInit} from "../map/MapDeInit"
import {api} from "./Api"
import {editorState} from "../state/EditorState"
import {FormatMode, PageState} from "./Enums"
import {M, ML} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {getNodeByPath} from "./MapUtils";

const editorStateDefault = JSON.stringify(editorState)

const findEditedNodeId = (ml: ML, g: G) => (
  g.sc.scope === 'c'
    ? getNodeByPath(ml, g.sc.lastPath).s[0].nodeId
    : getNodeByPath(ml, g.sc.lastPath).nodeId
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
      const ml = state.mapList[state.mapListIndex]
      const g = ml.filter((n) => n.path.length === 1).at(0) as G
      if (action.payload.type === 'startEditReplace') {
        state.editedNodeId = findEditedNodeId(ml, g)
        state.editType = 'replace'
      } else {
        const nm = mapReducer(ml, action.payload.type, action.payload.payload)
        const isMapChanged =
          JSON.stringify(mapDeInit.start(mapAssembly(ml) as M)) !==
          JSON.stringify(mapDeInit.start(mapAssembly(nm) as M))
        switch (action.payload.type) {
          case 'startEditAppend':
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nm]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = nm
            state.editedNodeId = findEditedNodeId(ml, g)
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
