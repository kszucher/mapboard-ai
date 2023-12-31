import {combineReducers, configureStore, createSlice, current, isAction, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {getMapX, getMapY} from "../components/map/MapDivUtils"
import {mapFindIntersecting} from "../selectors/MapFindIntersecting"
import {editorState} from "../state/EditorState"
import {DialogState, AlertDialogState, FormatMode, PageState, Side, LeftMouseMode} from "../state/Enums"
import {M} from "../state/MapStateTypes"
import {nodeApi} from "../apis/NodeApi"
import {mapFindNearest} from "../selectors/MapFindNearest"
import {mapReducer} from "./MapReducer"
import {getEditedNode, getX} from "../selectors/MapQueries.ts"
import {filterEmpty} from "../utils/Utils"
import {MR} from "./MapReducerEnum.ts"

const editorStateDefault = JSON.stringify(editorState)

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    setToken(state, action: PayloadAction<string>) { state.token = action.payload },
    resetState() {return JSON.parse(editorStateDefault)},
    setIsLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload},
    setLeftMouseMode(state, action: PayloadAction<LeftMouseMode>) { state. leftMouseMode = action.payload},
    setScrollOverride(state) { state.scrollOverride = true },
    clearScrollOverride(state) { state.scrollOverride = false },
    setPageState(state, action: PayloadAction<PageState>) { state.pageState = action.payload },
    setDialogState(state, action: PayloadAction<DialogState>) { state.dialogState = action.payload },
    setAlertDialogState(state, action: PayloadAction<AlertDialogState>) { state.alertDialogState = action.payload },
    setFormatMode(state, action: PayloadAction<FormatMode>) { state.formatMode = action.payload },
    openFormatter(state) { state.formatterVisible = true},
    closeFormatter(state) { state.formatterVisible = false},
    setZoomInfo(state, action: PayloadAction<any>) {state.zoomInfo = action.payload},
    showConnectionHelpers(state) { state.connectionHelpersVisible = true },
    hideConnectionHelpers(state) { state.connectionHelpersVisible = false },
    setConnectionStart(state, action: PayloadAction<any>) {state.connectionStart = action.payload},
    clearConnectionStart(state) {state.connectionStart = {fromNodeId: '', fromNodeSide: Side.R}},
    mapAction(state, action: PayloadAction<{ type: MR, payload: any }>) {
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
          const m = mapReducer(pm, MR.selectByRectangle, {pathList: nList.map(ti => ti.path)})
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
            const m = mapReducer(pm, MR.moveByDrag, {moveInsertParentNodeId, moveTargetIndex})
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
      isAction, () => {}
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
        state.mapList = mapDataList.map((el: M) => mapReducer(filterEmpty(el), MR.load, {}))
        state.mapListIndex = 0
        state.editedNodeId = ''
        state.isLoading = false
      }
    )
    builder.addMatcher(
      nodeApi.endpoints.getGptSuggestions.matchFulfilled,
      (state, { payload }) => {
        const { promptId, gptSuggestions } = payload
        console.log(payload)
        if (gptSuggestions) {
          const pm = current(state.mapList[state.mapListIndex])
          let mapAction = {type: MR.load, payload: {}}
          try {
            const gptParsed = JSON.parse(gptSuggestions)
            console.log(gptParsed)
            switch (promptId) {
              case 'gptGenNodesS': mapAction = {type: MR.gptParseNodesS, payload: {gptParsed}}; break
              case 'gptGenNodesT': mapAction = {type: MR.gptParseNodesT, payload: {gptParsed}}; break
              case 'gptGenNodeMermaid': mapAction = {type: MR.gptParseNodeMermaid, payload: {gptParsed}}; break
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
      () => {
        console.log('save completed')
      }
    )
  }
})

export const { actions } = editorSlice

export const store = configureStore({
  reducer: combineReducers({api: nodeApi.reducer, editor: editorSlice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(nodeApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
