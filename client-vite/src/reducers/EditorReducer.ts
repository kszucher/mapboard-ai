import {combineReducers, configureStore, createSlice, current, isAction, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {getMapX, getMapY} from "../components/map/MapDivUtils"
import {mapFindIntersecting} from "../queries/MapFindIntersecting"
import {editorState} from "../state/EditorState"
import {DialogState, AlertDialogState, FormatMode, PageState, Side, LeftMouseMode, MidMouseMode} from "../state/Enums"
import {api} from "../api/Api.ts"
import {mapFindNearestS} from "../queries/MapFindNearestS.ts"
import {mapMutation} from "./MapMutation.ts"
import {getXS, sortNode, sortPath} from "../queries/MapQueries.ts"
import {MM} from "./MapMutationEnum.ts"
import {R, S} from "../state/MapStateTypes.ts"
import {genId} from "../utils/Utils.ts"
import {mapInit} from "./MapInit.ts";
import {mapChain} from "./MapChain.ts";
import {mapCalcOrientation} from "./MapCalcOrientation.ts";
import {mapCalcTask} from "./MapCalcTask.ts";
import {mapMeasure} from "./MapMeasure.ts";
import {mapPlace} from "./MapPlace.ts";

const editorStateDefault = JSON.stringify(editorState)

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload
    },
    resetState() {
      return JSON.parse(editorStateDefault)
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setLeftMouseMode(state, action: PayloadAction<LeftMouseMode>) {
      state.leftMouseMode = action.payload
    },
    setMidMouseMode(state, action: PayloadAction<MidMouseMode>) {
      state.midMouseMode = action.payload
    },
    setDialogState(state, action: PayloadAction<DialogState>) {
      state.dialogState = action.payload
    },
    setAlertDialogState(state, action: PayloadAction<AlertDialogState>) {
      state.alertDialogState = action.payload
    },
    setFormatMode(state, action: PayloadAction<FormatMode>) {
      state.formatMode = action.payload
    },
    openFormatter(state) {
      state.formatterVisible = true
    },
    closeFormatter(state) {
      state.formatterVisible = false
    },
    setZoomInfo(state, action: PayloadAction<any>) {
      state.zoomInfo = action.payload
    },
    showConnectionHelpers(state) {
      state.connectionHelpersVisible = true
    },
    hideConnectionHelpers(state) {
      state.connectionHelpersVisible = false
    },
    setConnectionStart(state, action: PayloadAction<any>) {
      state.connectionStart = action.payload
    },
    clearConnectionStart(state) {
      state.connectionStart = {fromNodeId: '', fromNodeSide: Side.R}
    },
    undo(state) {
      state.editedNodeId = ''
      state.mapListIndex = state.mapListIndex > 0 ? state.mapListIndex - 1 : state.mapListIndex
    },
    redo(state) {
      state.editedNodeId = ''
      state.mapListIndex = state.mapListIndex < state.mapList.length - 1 ? state.mapListIndex + 1 : state.mapListIndex
    },
    saveView(state, action: PayloadAction<{ e: any }>) {
      const {e} = action.payload
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const mapX = getMapX(e)
      const mapY = getMapY(e)
      const x = originX + ((mapX - prevMapX) / scale)
      const y = originY + ((mapY - prevMapY) / scale)
      const ZOOM_INTENSITY = 0.2
      let newScale = scale * Math.exp((e.deltaY < 0 ? 1 : -1) * ZOOM_INTENSITY)
      if (newScale > 20) {
        newScale = 20
      }
      if (newScale < 0.2) {
        newScale = 0.2
      }
      state.zoomInfo.scale = newScale
      state.zoomInfo.prevMapX = mapX
      state.zoomInfo.prevMapY = mapY
      state.zoomInfo.translateX = (mapX - x) / newScale
      state.zoomInfo.translateY = (mapY - y) / newScale
      state.zoomInfo.originX = x
      state.zoomInfo.originY = y
    },
    saveFromCoordinates(state, action: PayloadAction<{e: any}>) {
      const {e} = action.payload
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      state.zoomInfo.fromX = originX + ((getMapX(e) - prevMapX) / scale)
      state.zoomInfo.fromY = originY + ((getMapY(e) - prevMapY) / scale)
    },
    selectSByRectanglePreview(state, action: PayloadAction<{e: any}>) {
      const {e} = action.payload
      const pm = current(state.mapList[state.mapListIndex].data)
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      state.selectionRectCoords = [Math.min(fromX, toX), Math.min(fromY, toY), Math.abs(toX - fromX), Math.abs(toY - fromY)]
      state.intersectingNodes = mapFindIntersecting(pm, fromX, fromY, toX, toY)
    },
    offsetRByDragPreview(state, action: PayloadAction<{r: R, e: any}>) {
      const {r, e} = action.payload
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale) - fromX + r.offsetW
      const toY = originY + ((getMapY(e) - prevMapY) / scale) - fromY + r.offsetH
      state.rOffsetCoords = [toX, toY, r.selfW, r.selfH]
    },
    moveSByDragPreview(state, action: PayloadAction<{s: S, e: any}>) {
      const {s, e} = action.payload
      const pm = current(state.mapList[state.mapListIndex].data)
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      const {sMoveCoords, sMoveInsertParentNodeId, sMoveTargetIndex} = mapFindNearestS(pm, s, toX, toY)
      state.sMoveCoords = sMoveCoords
      state.sMoveInsertParentNodeId = sMoveInsertParentNodeId
      state.sMoveTargetIndex = sMoveTargetIndex
    },
    startEditReplace(state) {
      const pm = current(state.mapList[state.mapListIndex].data)
      state.editStartMapListIndex = state.mapListIndex
      state.editedNodeId = getXS(pm).nodeId
      state.editType = 'replace'
    },
    startEditAppend(state) {
      const pm = current(state.mapList[state.mapListIndex].data)
      state.editStartMapListIndex = state.mapListIndex
      state.editedNodeId = getXS(pm).nodeId
      state.editType = 'append'
    },
    removeMapListEntriesOfEdit(state) {
      state.editedNodeId = ''
      state.editType = ''
      state.mapList = [...state.mapList.slice(0, state.editStartMapListIndex + 1), ...state.mapList.slice(-1)]
      state.mapListIndex = state.editStartMapListIndex + 1
    },
    mapReducer(state, action: PayloadAction<{ type: MM, payload?: any }>) {
      const pm = current(state.mapList[state.mapListIndex].data)
      const m = structuredClone(pm).sort(sortPath)
      mapMutation(m, action.payload.type, action.payload.payload)
      mapInit(m)
      mapChain(m)
      mapCalcOrientation(m)
      mapCalcTask(m)
      mapMeasure(pm, m)
      mapPlace(m)
      m.sort(sortNode)
      if (!isEqual(pm, m)) {
        state.mapList = [...state.mapList.slice(0, state.mapListIndex + 1), {commitId: genId(), data: m}]
        state.mapListIndex = state.mapListIndex + 1
      }
      switch (action.payload.type) {
        case 'selectSByRectangle': {
          state.selectionRectCoords = []
          state.intersectingNodes = []
          break
        }
        case 'offsetRByDrag': {
          state.rOffsetCoords = []
          break
        }
        case 'moveSByDrag': {
          state.sMoveCoords = []
          state.sMoveInsertParentNodeId = ''
          state.sMoveTargetIndex = 0
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
      api.endpoints.signIn.matchFulfilled,
      (state) => {
        state.pageState = PageState.WS
      }
    )
    builder.addMatcher(
      api.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        console.log(payload)
        const { mapData } = structuredClone(payload)
        const pm = mapData.filter(el =>
          Object.keys(el).length !== 0 &&
          el.hasOwnProperty('nodeId') &&
          el.hasOwnProperty('path')
        )
        const m = structuredClone(pm).sort(sortPath)
        mapInit(m)
        mapChain(m)
        mapCalcOrientation(m)
        mapCalcTask(m)
        mapMeasure(pm, m)
        mapPlace(m)
        m.sort(sortNode)
        state.mapList = [{commitId: genId(), data: m}]
        state.mapListIndex = 0
        state.editedNodeId = ''
        state.isLoading = false
      }
    )
    builder.addMatcher(
      api.endpoints.saveMap.matchFulfilled,
      (state, {payload}) => {
        state.lastMergedCommitId = payload.commitId
        console.log('commit ' + payload.commitId + ' saved')
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
