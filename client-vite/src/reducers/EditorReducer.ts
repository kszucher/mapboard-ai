import {combineReducers, configureStore, createListenerMiddleware, createSlice, current, isAction, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {getMapX, getMapY} from "../components/MapDivUtils"
import {editorState} from "../state/EditorState"
import {FormatMode, PageState, Sides} from "../state/Enums"
import {M} from "../state/MapStateTypes"
import {nodeApi} from "../apis/NodeApi"
import {mapFindNearest} from "../selectors/MapFindNearest"
import {mapReducer} from "./MapReducer"
import {getEditedNode, getX} from "../selectors/MapSelector"
import {filterEmpty} from "../utils/Utils"

const editorStateDefault = JSON.stringify(editorState)

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    setToken(state, action: PayloadAction<string>) { state.token = action.payload },
    resetState() {return JSON.parse(editorStateDefault)},
    setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },
    setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
    openFormatter(state) { state.formatterVisible = true},
    closeFormatter(state) { state.formatterVisible = false},
    toggleTabShrink(state) { state.tabShrink = !state.tabShrink },
    openMoreMenu(state, action: PayloadAction<boolean>) { state.moreMenu = action.payload },
    closeMoreMenu(state) { state.moreMenu = false },
    openFrameMenu(state, action: PayloadAction<boolean>) { state.frameMenu = action.payload },
    closeFrameMenu(state) { state.frameMenu = false },
    openContextMenu(state, action: PayloadAction<{ type: 'map' | 'node', position: { x: number, y: number }}>) {
      state.contextMenu = {isActive: true, type: action.payload.type, position: action.payload.position }
    },
    closeContextMenu(state) { state.contextMenu.isActive = false },
    setSelectionRectCoords(state, action: PayloadAction<any>) {state.selectionRectCoords = action.payload},
    setIntersectingNodes(state, action: PayloadAction<any>) {state.intersectingNodes = action.payload},
    setZoomInfo(state, action: PayloadAction<any>) {state.zoomInfo = action.payload},
    showConnectionHelpers(state) { state.connectionHelpersVisible = true },
    hideConnectionHelpers(state) { state.connectionHelpersVisible = false },
    setConnectionStart(state, action: PayloadAction<any>) {state.connectionStart = action.payload},
    resetConnectionStart(state) {state.connectionStart = {fromNodeId: '', fromNodeSide: Sides.R}},
    mapAction(state, action: PayloadAction<{ type: string, payload: any }>) {
      // TODO check edit/view condition
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
          const {t, e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY } = state.zoomInfo
          const mapX = getMapX(e)
          const mapY = getMapY(e)
          const toX = originX + ((mapX - prevMapX) / scale)
          const toY = originY + ((mapY - prevMapY) / scale)
          const {moveCoords} = mapFindNearest(pm, t, toX, toY)
          state.moveCoords = moveCoords
          break
        }
        case 'drag': {
          const {t, e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY } = state.zoomInfo
          const mapX = getMapX(e)
          const mapY = getMapY(e)
          const toX = originX + ((mapX - prevMapX) / scale)
          const toY = originY + ((mapY - prevMapY) / scale)
          const {moveInsertParentNodeId, moveTargetIndex} = mapFindNearest(pm, t, toX, toY)
          if (moveInsertParentNodeId.length) {
            const m = mapReducer(pm, 'drag', {moveInsertParentNodeId, moveTargetIndex})
            if (!isEqual(pm, m)) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
              state.mapListIndex = state.mapListIndex + 1
            }
          }
          state.moveCoords = []
          break
        }
        case 'startEditReplace': {
          state.editedNodeId = getEditedNode(pm, getX(pm).path).nodeId
          state.editType = 'replace'
          break
        }
        case 'startEditAppend': {
          state.editedNodeId = getEditedNode(pm, getX(pm).path).nodeId
          state.editType = 'append'
          break
        }
        case 'typeText': {
          const m = mapReducer(pm, 'typeText', action.payload.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex), m]
          }
          break
        }
        case 'finishEdit': {
          const { path, content } = action.payload.payload
          let m
          if (content.substring(0, 2) === '\\[') {
            m = mapReducer(pm, 'finishEdit', {path, contentType: 'equation', content})
          } else if (content.startsWith('graph') || content.startsWith('sequenceDiagram')) {
            m = mapReducer(pm, 'finishEdit', {path, contentType: 'mermaid', content})
          } else {
            m = mapReducer(pm, 'finishEdit', {path, contentType: 'text', content})
          }
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
          break
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAction, (state, action) => {}
    )
    builder.addMatcher(
      nodeApi.endpoints.signIn.matchFulfilled,
      (state) => {state.pageState = PageState.WS}
    )
    builder.addMatcher(
      nodeApi.endpoints.getShares.matchFulfilled,
      (state) => {state.pageState = PageState.WS}
    )
    builder.addMatcher(
      nodeApi.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        const { mapDataList } = payload
        console.log(payload)
        state.mapList = mapDataList.map((el: M) => mapReducer(filterEmpty(el), 'LOAD', {}))
        state.mapListIndex = 0
        state.editedNodeId = ''
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      nodeApi.endpoints.getGptSuggestions.matchFulfilled,
      (state, { payload }) => {
        const { promptId, promptJson, prompt, maxToken, gptSuggestions } = payload
        console.log(payload)
        state.pageState = PageState.WS
        if (gptSuggestions) {
          const pm = current(state.mapList[state.mapListIndex])
          let mapAction = {type: '', payload: {}}
          try {
            const gptParsed = JSON.parse(gptSuggestions)
            console.log(gptParsed)
            switch (promptId) {
              case 'gptGenNodesS': mapAction = {type: 'gptParseNodesS', payload: {gptParsed}}; break
              case 'gptGenNodesT': mapAction = {type: 'gptParseNodesT', payload: {gptParsed}}; break
              case 'gptGenNodeMermaid': mapAction = {type: 'gptParseNodeMermaid', payload: {gptParsed}}; break
            }
          } catch {
            console.warn('unparseable:', gptSuggestions)
          }
          const m = mapReducer(pm, mapAction.type, mapAction.payload)
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
        }
      }
    )
    builder.addMatcher(
      nodeApi.endpoints.saveMap.matchFulfilled,
      (state) => {
        console.log('save completed')
      }
    )
  }
})

export const { actions } = editorSlice

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  predicate: (action, currentState) => {
   return (
    action.type.startsWith('editor') &&
    action.type !== 'editor/closeContextMenu' &&
    action.type !== 'editor/openContextMenu' &&
    action.type !== 'editor/resetConnectionStart' &&
    (currentState as RootState).editor.contextMenu !== null
   )
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(actions.closeContextMenu())
  },
})

export const store = configureStore({
  reducer: combineReducers({api: nodeApi.reducer, editor: editorSlice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .prepend(listenerMiddleware.middleware)
    .concat(nodeApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
