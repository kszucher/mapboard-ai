import {combineReducers, configureStore, createSlice, current, isAction, isAnyOf, PayloadAction} from "@reduxjs/toolkit"
import {getMapX, getMapY} from "../componentsMap/MapDivUtils.ts"
import {mapFindIntersecting} from "../mapQueries/MapFindIntersecting.ts"
import {editorState, editorStateDefault} from "../editorState/EditorState.ts"
import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "../consts/Enums.ts"
import {api} from "../api/Api.ts"
import {mapFindNearestS} from "../mapQueries/MapFindNearestS.ts"
import {wrappedFunctions} from "../mapMutations/MapMutations.ts"
import {getXS, mapObjectToArray} from "../mapQueries/MapQueries.ts"
import {R} from "../mapState/MapStateTypes.ts"
import {EditorState} from "../editorState/EditorStateTypes.ts"
import React from "react"
import {mapBuild} from "../mapMutations/MapBuild.ts"

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    resetState() {
      return JSON.parse(editorStateDefault)
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
      const pm = current(state.commitList[state.commitIndex])
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      state.selectionRectCoords = [Math.min(fromX, toX), Math.min(fromY, toY), Math.abs(toX - fromX), Math.abs(toY - fromY)]
      state.intersectingNodes = mapFindIntersecting(pm, fromX, fromY, toX, toY)
    },
    selectSByRectanglePreviewClear(state) {
      state.selectionRectCoords = []
      state.intersectingNodes = []
    },
    offsetRByDragPreview(state, action: PayloadAction<{r: R, e: MouseEvent}>) {
      const {r, e} = action.payload
      const {fromX, fromY, scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale) - fromX + r.offsetW
      const toY = originY + ((getMapY(e) - prevMapY) / scale) - fromY + r.offsetH
      state.rOffsetCoords = [toX, toY, r.selfW, r.selfH]
    },
    offsetRByDragPreviewClear(state) {
      state.rOffsetCoords = []
    },
    moveSByDragPreview(state, action: PayloadAction<{e: MouseEvent}>) {
      const {e} = action.payload
      const pm = current(state.commitList[state.commitIndex])
      const {scale, prevMapX, prevMapY, originX, originY} = state.zoomInfo
      const toX = originX + ((getMapX(e) - prevMapX) / scale)
      const toY = originY + ((getMapY(e) - prevMapY) / scale)
      const {sMoveCoords, insertLocation} = mapFindNearestS(pm, toX, toY)
      state.sMoveCoords = sMoveCoords
      state.insertLocation = insertLocation
    },
    moveSByDragPreviewClear(state) {
      state.sMoveCoords = []
      state.insertLocation = {sl: '', su: '', sd: ''}
    },
    startEditReplace(state) {
      const pm = current(state.commitList[state.commitIndex])
      state.editStartMapListIndex = state.commitIndex
      state.editedNodeId = getXS(pm).nodeId
      state.editType = 'replace'
    },
    startEditAppend(state) {
      const pm = current(state.commitList[state.commitIndex])
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
    ...wrappedFunctions
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAction, () => {}
    )
    builder.addMatcher(
      isAnyOf(
        api.endpoints.toggleColorMode.matchPending,
        api.endpoints.selectMap.matchPending,
        api.endpoints.renameMap.matchPending,
        api.endpoints.createMapInMap.matchPending,
        api.endpoints.createMapInTab.matchPending,
        api.endpoints.createMapInTabDuplicate.matchPending,
        api.endpoints.moveUpMapInTab.matchPending,
        api.endpoints.moveDownMapInTab.matchPending,
        api.endpoints.deleteMap.matchPending,
        api.endpoints.acceptShare.matchPending,
        api.endpoints.deleteShare.matchPending,
        api.endpoints.deleteAccount.matchPending,
      ),
      (state) => {
        state.isLoading = true
      }
    )
    builder.addMatcher(
      api.endpoints.signIn.matchFulfilled,
      (state, { payload }) => {
        state.pageState = PageState.WS
        state.connectionId = payload.connectionId
      }
    )
    builder.addMatcher(
      api.endpoints.openWorkspace.matchFulfilled,
      (state, { payload }) => {
        console.log(payload)
        const isValid = Object.values(payload.mapData).every(obj => Object.keys(obj).includes('path'))
        if (isValid) {
          const data = mapObjectToArray(payload.mapData)
          const m = structuredClone(data)
          mapBuild(m, m)
          state.mapId = payload.mapId
          state.commitList = [m]
          state.commitIndex = 0
          state.latestMapData = structuredClone(data)
          state.editedNodeId = ''
          state.isLoading = false
        } else {
          window.alert('invalid openWorkspace map')
        }
      }
    )
    builder.addMatcher(
      api.endpoints.getLatestMerged.matchFulfilled,
      (state, { payload }) => {
        console.log(payload)
        const isValid = Object.values(payload.mapData).every(obj => Object.keys(obj).includes('path'))
        if (isValid) {
          const data = mapObjectToArray(payload.mapData)
          state.latestMapData = structuredClone(data)
          console.log('new base map loaded')
        } else {
          window.alert('invalid getLatestMerged map')
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
