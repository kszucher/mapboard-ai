import {combineReducers, configureStore, createSlice, current, PayloadAction} from "@reduxjs/toolkit"
import {mapReducer} from "../map/MapReducer"
import {api} from "../core/Api"
import {editorState} from "../state/EditorState"
import {FormatMode, PageState} from "../core/Enums"
import {M} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {getNodeByPath} from "../map/MapUtils";
import isEqual from "react-fast-compare";

const editorStateDefault = JSON.stringify(editorState)

const findEditedNodeId = (m: M, g: G) => (
  g.sc.scope === 'c'
    ? getNodeByPath(m, g.sc.lastPath).s[0].nodeId
    : getNodeByPath(m, g.sc.lastPath).nodeId
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
      const m = current(state.mapList[state.mapListIndex])
      const g = m.filter((n) => n.path.length === 1).at(0) as G
      if (action.payload.type === 'startEditReplace') {
        state.editedNodeId = findEditedNodeId(m, g)
        state.editType = 'replace'
      } else {
        const nml = mapReducer(m, action.payload.type, action.payload.payload)
        const isMapChanged = !isEqual(m, nml)
        switch (action.payload.type) {
          case 'startEditAppend':
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nml]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = nml
            state.editedNodeId = findEditedNodeId(m, g)
            state.editType = 'append'
            break
          case 'typeText':
            state.tempMap = nml
            break;
          case 'finishEdit':
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nml]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = []
            state.editedNodeId = ''
            state.editType = ''
            break
          default:
            if (isMapChanged) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), nml]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = []
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
        state.mapList = mapDataList.map((el) => mapReducer(el, 'LOAD', {}))
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
