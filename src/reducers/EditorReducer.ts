import {combineReducers, configureStore, createSlice, current, isAction, PayloadAction} from "@reduxjs/toolkit"
import isEqual from "react-fast-compare"
import {getMapX, getMapY} from "../components/map/MapDivUtils.ts"
import {mapFindIntersecting} from "../mapQueries/MapFindIntersecting.ts"
import {editorState, editorStateDefault} from "../state/EditorState.ts"
import {DialogState, AlertDialogState, FormatMode, PageState, Side, LeftMouseMode, MidMouseMode} from "../state/Enums.ts"
import {api} from "../api/Api.ts"
import {mapFindNearestS} from "../mapQueries/MapFindNearestS.ts"
import {mapMutation} from "../mapMutations/MapMutation.ts"
import {getXS} from "../mapQueries/MapQueries.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {M, R} from "../state/MapStateTypes.ts"
import {genId} from "../utils/Utils.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {mapCalcTask} from "../mapMutations/MapCalcTask.ts"
import {mapMeasure} from "../mapMutations/MapMeasure.ts"
import {mapPlace} from "../mapMutations/MapPlace.ts"
import {sortNode, sortPath} from "../mapMutations/MapSort.ts"
import {mapDeInit} from "../mapMutations/MapDeInit.ts"
import {EditorState} from "../state/EditorStateTypes.ts"
import React from "react"

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
    setZoomInfo(state, action: PayloadAction<Omit<EditorState['zoomInfo'], 'fromX' | 'fromY'>>) {
      state.zoomInfo.scale = action.payload.scale
      state.zoomInfo.prevMapX = action.payload.prevMapX
      state.zoomInfo.prevMapY = action.payload.prevMapY
      state.zoomInfo.translateX = action.payload.translateX
      state.zoomInfo.translateY = action.payload.translateY
      state.zoomInfo.originX = action.payload.originX
      state.zoomInfo.originY = action.payload.originY
    },
    showConnectionHelpers(state) {
      state.connectionHelpersVisible = true
    },
    hideConnectionHelpers(state) {
      state.connectionHelpersVisible = false
    },
    setConnectionStart(state, action: PayloadAction<EditorState['connectionStart']>) {
      state.connectionStart = action.payload
    },
    clearConnectionStart(state) {
      state.connectionStart = {fromNodeId: '', fromNodeSide: Side.R}
    },
    undo(state) {
      state.editedNodeId = ''
      state.commitIndex = state.commitIndex > 0 ? state.commitIndex - 1 : state.commitIndex
    },
    redo(state) {
      state.editedNodeId = ''
      state.commitIndex = state.commitIndex < state.commitList.length - 1 ? state.commitIndex + 1 : state.commitIndex
    },
    saveView(state, action: PayloadAction<{ e: React.WheelEvent }>) {
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
    saveFromCoordinates(state, action: PayloadAction<{e: React.MouseEvent}>) {
      const {e} = action.payload
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      state.zoomInfo.fromX = originX + ((getMapX(e) - prevMapX) / scale)
      state.zoomInfo.fromY = originY + ((getMapY(e) - prevMapY) / scale)
    },
    selectSByRectanglePreview(state, action: PayloadAction<{e: MouseEvent}>) {
      const {e} = action.payload
      const pm = current(state.commitList[state.commitIndex].data)
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      state.selectionRectCoords = [Math.min(fromX, toX), Math.min(fromY, toY), Math.abs(toX - fromX), Math.abs(toY - fromY)]
      state.intersectingNodes = mapFindIntersecting(pm, fromX, fromY, toX, toY)
    },
    offsetRByDragPreview(state, action: PayloadAction<{r: R, e: MouseEvent}>) {
      const {r, e} = action.payload
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale) - fromX + r.offsetW
      const toY = originY + ((getMapY(e) - prevMapY) / scale) - fromY + r.offsetH
      state.rOffsetCoords = [toX, toY, r.selfW, r.selfH]
    },
    moveSByDragPreview(state, action: PayloadAction<{e: MouseEvent}>) {
      const {e} = action.payload
      const pm = current(state.commitList[state.commitIndex].data)
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      const {sMoveCoords, sL, sU, sD} = mapFindNearestS(pm, toX, toY)
      state.sMoveCoords = sMoveCoords
      state.sL = sL
      state.sU = sU
      state.sD = sD
    },
    startEditReplace(state) {
      const pm = current(state.commitList[state.commitIndex].data)
      state.editStartMapListIndex = state.commitIndex
      state.editedNodeId = getXS(pm).nodeId
      state.editType = 'replace'
    },
    startEditAppend(state) {
      const pm = current(state.commitList[state.commitIndex].data)
      state.editStartMapListIndex = state.commitIndex
      state.editedNodeId = getXS(pm).nodeId
      state.editType = 'append'
    },
    removeMapListEntriesOfEdit(state) {
      state.editedNodeId = ''
      state.editType = ''
      state.commitList = [...state.commitList.slice(0, state.editStartMapListIndex + 1), ...state.commitList.slice(-1)]
      state.commitIndex = state.editStartMapListIndex + 1
    },
    mapReducer(state, action: PayloadAction<{ type: MM, payload?: object}>) {
      switch (action.payload.type) {
        case 'selectSByRectangle': {
          action.payload.payload = {intersectingNodes: state.intersectingNodes}
          break
        }
        case 'offsetRByDrag': {
          action.payload.payload = {
            toX: state.rOffsetCoords[0],
            toY: state.rOffsetCoords[1]
          }
          break
        }
        case 'moveSByDrag': {
          action.payload.payload = {
            sL: state.sL,
            sU: state.sU,
            sD: state.sD
          }
          break
        }
      }
      const pm = current(state.commitList[state.commitIndex].data)
      const m = structuredClone(pm)
      mapMutation(m, action.payload.type, action.payload.payload)
      m.sort(sortPath)
      mapInit(m)
      mapChain(m)
      mapCalcTask(m)
      mapMeasure(pm, m)
      mapPlace(m)
      m.sort(sortNode)
      if (!isEqual(mapDeInit(pm), mapDeInit(m))) {
        state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), {commitId: genId(), data: Object.freeze(m) as M}]
        state.commitIndex = state.commitIndex + 1
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
          state.sL = ''
          state.sU = ''
          state.sD = ''
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
          Object.hasOwn(el, 'nodeId') &&
          Object.hasOwn(el, 'path')
        )
        const m = structuredClone(pm)
        m.sort(sortPath)
        mapInit(m)
        mapChain(m)
        mapCalcTask(m)
        mapMeasure(pm, m)
        mapPlace(m)
        m.sort(sortNode)
        const commitId = genId()
        state.commitList = [{commitId, data: Object.freeze(m) as M}]
        state.commitIndex = 0
        state.lastMergedCommitId = commitId
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
