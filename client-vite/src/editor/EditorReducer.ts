import {combineReducers, configureStore, createSlice, current, PayloadAction} from "@reduxjs/toolkit"
import {getCoords} from "../component/MapDivUtils"
import {mapActionResolver} from "../map/MapActionResolver"
import {mapFindNearest} from "../map/MapFindNearest"
import {mapReducer} from "../map/MapReducer"
import {api} from "../core/Api"
import {editorState} from "../state/EditorState"
import {FormatMode, PageState} from "../core/Enums"
import {getEditedNode, getXP} from "../map/MapUtils"
import isEqual from "react-fast-compare"

const editorStateDefault = JSON.stringify(editorState)

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
    setSelectionRectCoords(state, action: PayloadAction<any>) {state.selectionRectCoords = action.payload},
    setIntersectingNodes(state, action: PayloadAction<any>) {state.intersectingNodes = action.payload},
    mapAction(state, action: PayloadAction<{ type: string, payload: any }>) {
      const pm = current(state.mapList[state.mapListIndex])
      switch (action.payload.type) {
        case 'undo': {
          state.editedNodeId = ''
          state.mapListIndex = state.mapListIndex > 0 ? state.mapListIndex - 1 : state.mapListIndex
          break
        }
        case 'redo': {
          state.editedNodeId = ''
          state.mapListIndex = state.mapListIndex < state.mapList.length - 1 ? state.mapListIndex + 1 : state.mapListIndex
          break
        }
        case 'simulateDrag': {
          const {n, e} = action.payload.payload
          const toCoords = getCoords(e)
          const {moveCoords} = mapFindNearest(pm, n, toCoords.x, toCoords.y)
          state.moveCoords = moveCoords
          break
        }
        case 'drag': {
          const {n, e} = action.payload.payload
          const toCoords = getCoords(e)
          const {moveTargetPath, moveTargetIndex} = mapFindNearest(pm, n, toCoords.x, toCoords.y)
          if (moveTargetPath.length) {
            const m = mapReducer(pm, 'drag', {moveTargetPath, moveTargetIndex})
            if (!isEqual(pm, m)) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
              state.mapListIndex = state.mapListIndex + 1
            }
            state.tempMap = []
          }
          state.moveCoords = []
          break
        }
        case 'startEditReplace': {
          state.editedNodeId = getEditedNode(pm, getXP(pm)).nodeId
          state.editType = 'replace'
          break
        }
        case 'startEditAppend': {
          const m = mapReducer(pm, 'startEditAppend', action.payload.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
          state.tempMap = m
          state.editedNodeId = getEditedNode(pm, getXP(pm)).nodeId
          state.editType = 'append'
          break
        }
        case 'typeText': {
          const m = mapReducer(pm, 'typeText', action.payload.payload)
          state.tempMap = m
          break
        }
        case 'finishEdit': {
          const m = mapReducer(pm, 'finishEdit', action.payload.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
          state.tempMap = []
          state.editedNodeId = ''
          state.editType = ''
          break
        }
        default: {
          const m = mapReducer(pm, action.payload.type, action.payload.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
          state.tempMap = []
          break
        }
      }
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
        state.mapList = mapDataList.map((el) => mapReducer(el, 'LOAD', {}))
        state.mapListIndex = 0
        state.editedNodeId = ''
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      api.endpoints.getGptSuggestions.matchFulfilled,
      (state, { payload }) => {
        const { gptSuggestions, prompt, context, content, typeNodes, numNodes } = payload
        console.log(payload)
        if (gptSuggestions) {
          console.log(gptSuggestions)
          const gptSuggestionsItemized = ['alma', 'korte', 'banan']
          const pm = current(state.mapList[state.mapListIndex])
          const mapAction = mapActionResolver(pm, null, 'ae' , { type: 'insertGptSuggestions', payload: { gptSuggestionsItemized } })
          const m = mapReducer(pm, mapAction.type, mapAction.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
        }
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
export type AppDispatch = typeof store.dispatch
