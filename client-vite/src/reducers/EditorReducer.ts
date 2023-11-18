import {combineReducers, configureStore, createListenerMiddleware, createSlice, current, isAction, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {getMapX, getMapY} from "../components/map/MapDivUtils"
import {mapFindIntersecting} from "../selectors/MapFindIntersecting"
import {editorState} from "../state/EditorState"
import {DialogState, FormatMode, PageState, Sides} from "../state/Enums"
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
    setScrollOverride(state) { state.scrollOverride = true },
    clearScrollOverride(state) { state.scrollOverride = false },
    setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },
    setDialogState(state, action: PayloadAction<DialogState>) { state.dialogState = action.payload },
    setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
    openFormatter(state) { state.formatterVisible = true},
    closeFormatter(state) { state.formatterVisible = false},
    openMoreMenu(state, action: PayloadAction<boolean>) { state.moreMenu = action.payload },
    closeMoreMenu(state) { state.moreMenu = false },
    openFrameMenu(state, action: PayloadAction<boolean>) { state.frameMenu = action.payload },
    closeFrameMenu(state) { state.frameMenu = false },
    openContextMenu(state, action: PayloadAction<{ type: 'map' | 'node', position: { x: number, y: number }}>) {
      state.contextMenu = {isActive: true, type: action.payload.type, position: action.payload.position }
    },
    closeContextMenu(state) { state.contextMenu.isActive = false },
    setZoomInfo(state, action: PayloadAction<any>) {state.zoomInfo = action.payload},
    showConnectionHelpers(state) { state.connectionHelpersVisible = true },
    hideConnectionHelpers(state) { state.connectionHelpersVisible = false },
    setConnectionStart(state, action: PayloadAction<any>) {state.connectionStart = action.payload},
    clearConnectionStart(state) {state.connectionStart = {fromNodeId: '', fromNodeSide: Sides.R}},
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
        case 'saveView': {
          const {e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          const mapX = getMapX(e)
          const mapY = getMapY(e)
          const x = originX + ((mapX - prevMapX) / scale)
          const y = originY + ((mapY - prevMapY) / scale)
          const ZOOM_INTENSITY = 0.2
          let newScale = scale * Math.exp((e.deltaY < 0 ? 1 : -1) * ZOOM_INTENSITY)
          if (newScale > 20) {newScale = 20}
          if (newScale < 0.2) {newScale = 0.2}
          state.zoomInfo.scale = newScale
          state.zoomInfo.prevMapX = mapX
          state.zoomInfo.prevMapY = mapY
          state.zoomInfo.translateX = (mapX - x) / newScale
          state.zoomInfo.translateY = (mapY - y) / newScale
          state.zoomInfo.originX = x
          state.zoomInfo.originY = y
          break
        }
        case 'saveFromCoordinates': {
          const {e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          state.zoomInfo.fromX = originX + ((getMapX(e) - prevMapX) / scale)
          state.zoomInfo.fromY = originY + ((getMapY(e) - prevMapY) / scale)
          break
        }
        case 'selectByRectanglePreview': {
          const {e} = action.payload.payload
          const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          const toX = originX + ((getMapX(e) - prevMapX) / scale)
          const toY = originY + ((getMapY(e) - prevMapY) / scale)
          state.selectionRectCoords = [Math.min(fromX, toX), Math.min(fromY, toY), Math.abs(toX - fromX), Math.abs(toY - fromY)]
          state.intersectingNodes = mapFindIntersecting(pm, fromX, fromY, toX, toY)
          break
        }
        case 'selectByRectangle': {
          const {e} = action.payload.payload
          const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          const toX = originX + ((getMapX(e) - prevMapX) / scale)
          const toY = originY + ((getMapY(e) - prevMapY) / scale)
          const nList = mapFindIntersecting(pm, fromX, fromY, toX, toY)
          const m = mapReducer(pm, 'selectByRectangle', {pathList: nList.map(ti => ti.path)})
          if (!isEqual(pm, m)) {
            state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
            state.mapListIndex = state.mapListIndex + 1
          }
          state.selectionRectCoords = []
          state.intersectingNodes = []
          break
        }
        case 'moveByDragPreview': {
          const {t, e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          const toX = originX + ((getMapX(e) - prevMapX) / scale)
          const toY = originY + ((getMapY(e) - prevMapY) / scale)
          const {moveCoords} = mapFindNearest(pm, t, toX, toY)
          state.moveCoords = moveCoords
          break
        }
        case 'moveByDrag': {
          const {t, e} = action.payload.payload
          const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
          const toX = originX + ((getMapX(e) - prevMapX) / scale)
          const toY = originY + ((getMapY(e) - prevMapY) / scale)
          const {moveInsertParentNodeId, moveTargetIndex} = mapFindNearest(pm, t, toX, toY)
          if (moveInsertParentNodeId.length) {
            const m = mapReducer(pm, 'moveByDrag', {moveInsertParentNodeId, moveTargetIndex})
            if (!isEqual(pm, m)) {
              state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), m]
              state.mapListIndex = state.mapListIndex + 1
            }
          }
          state.moveCoords = []
          break
        }
        case 'startEditReplace': {
          state.editStartMapListIndex = state.mapListIndex
          state.editedNodeId = getEditedNode(pm, getX(pm).path).nodeId
          state.editType = 'replace'
          break
        }
        case 'startEditAppend': {
          state.editStartMapListIndex = state.mapListIndex
          state.editedNodeId = getEditedNode(pm, getX(pm).path).nodeId
          state.editType = 'append'
          break
        }
        case 'removeMapListEntriesOfEdit': {
          state.editedNodeId = ''
          state.editType = ''
          state.mapList = [...state.mapList.slice(0, state.editStartMapListIndex + 1), ...state.mapList.slice(-1)]
          state.mapListIndex = state.editStartMapListIndex + 1
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
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAction, (state, action) => {}
    )
    builder.addMatcher(
      nodeApi.endpoints.signIn.matchFulfilled,
      (state) => {
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      nodeApi.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        const { mapDataList } = payload
        console.log(payload)
        state.mapList = mapDataList.map((el: M) => mapReducer(filterEmpty(el), 'LOAD', {}))
        state.mapListIndex = 0
        state.editedNodeId = ''
      }
    )
    builder.addMatcher(
      nodeApi.endpoints.getGptSuggestions.matchFulfilled,
      (state, { payload }) => {
        const { promptId, promptJson, prompt, maxToken, gptSuggestions } = payload
        console.log(payload)
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
      action.type !== 'editor/clearConnectionStart' &&
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
