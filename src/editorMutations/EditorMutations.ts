import {createSlice, isAction, isAnyOf, PayloadAction} from "@reduxjs/toolkit"
import React from "react"
import {AlertDialogState, DialogState, LeftMouseMode, MidMouseMode, PageState} from "../editorState/EditorEnums.ts"
import {editorState, editorStateDefault} from "../editorState/EditorState.ts"
import {EditorState} from "../editorState/EditorStateTypes.ts"
import {getMapX, getMapY} from "../mapComponents/MapDivUtils.ts"
import {mapBuild} from "../mapMutations/MapBuild.ts"
import {wrappedFunctions} from "../mapMutations/MapMutations.ts"
import {mapObjectToArray} from "../mapQueries/MapQueries.ts"
import {Side} from "../mapState/MapEnums.ts"
import {R} from "../mapState/MapStateTypes.ts"
import {api} from "../rootComponent/RootComponent.tsx"

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
    startEditReplace(state) {
      // const pm = current(state.commitList[state.commitIndex])
      state.editStartMapListIndex = state.commitIndex
      // state.editedNodeId = getXS(pm).nodeId
      state.editType = 'replace'
    },
    startEditAppend(state) {
      // const pm = current(state.commitList[state.commitIndex])
      state.editStartMapListIndex = state.commitIndex
      // state.editedNodeId = getXS(pm).nodeId
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
        api.endpoints.updateShareStatusAccepted.matchPending,
        api.endpoints.withdrawShare.matchPending,
        api.endpoints.rejectShare.matchPending,
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
          mapBuild(m)
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
