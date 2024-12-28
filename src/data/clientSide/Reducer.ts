import { createSlice, current, isAction, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { getMapX, getMapY } from '../../components/map/UtilsDiv.ts';
import { api } from '../serverSide/Api.ts';
import { editorStateDefault, editorStateDefaults } from './EditorStateDefaults.ts';
import { AlertDialogState, DialogState, EditorState, MidMouseMode, PageState } from './EditorStateTypes.ts';
import { idToR, mapObjectToArray } from './mapGetters/MapQueries.ts';
import { mapBuild } from './mapSetters/MapBuild.ts';
import { mapDelete } from './mapSetters/MapDelete.ts';
import { mapInsert } from './mapSetters/MapInsert.ts';
import { ControlType, L, R, Side } from './mapState/MapStateTypes.ts';

const updateRootProp = (state: EditorState, nodeId: string, override: object) => {
  const m = structuredClone(current(state.commitList[state.commitIndex]));
  Object.assign(idToR(m, nodeId), override);
  mapBuild(m);
  state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
  state.commitIndex = state.commitIndex + 1;
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState: editorStateDefaults,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    resetState() {
      return JSON.parse(editorStateDefault);
    },
    setMidMouseMode(state, action: PayloadAction<MidMouseMode>) {
      state.midMouseMode = action.payload;
    },
    setDialogState(state, action: PayloadAction<DialogState>) {
      state.dialogState = action.payload;
    },
    setAlertDialogState(state, action: PayloadAction<AlertDialogState>) {
      state.alertDialogState = action.payload;
    },
    setZoomInfo(state, action: PayloadAction<Omit<EditorState['zoomInfo'], 'fromX' | 'fromY'>>) {
      state.zoomInfo.scale = action.payload.scale;
      state.zoomInfo.prevMapX = action.payload.prevMapX;
      state.zoomInfo.prevMapY = action.payload.prevMapY;
      state.zoomInfo.translateX = action.payload.translateX;
      state.zoomInfo.translateY = action.payload.translateY;
      state.zoomInfo.originX = action.payload.originX;
      state.zoomInfo.originY = action.payload.originY;
    },
    setLinkHelpersVisible(state, { payload }: PayloadAction<boolean>) {
      state.linkHelpersVisible = payload;
    },
    setRootFrameVisible(state, { payload }: PayloadAction<boolean>) {
      state.rootFrameVisible = payload;
    },
    setConnectionStart(state, action: PayloadAction<EditorState['connectionStart']>) {
      state.connectionStart = action.payload;
    },
    clearConnectionStart(state) {
      state.connectionStart = { fromNodeId: '', fromNodeSide: Side.R };
    },
    undo(state) {
      state.commitIndex = state.commitIndex > 0 ? state.commitIndex - 1 : state.commitIndex;
    },
    redo(state) {
      state.commitIndex = state.commitIndex < state.commitList.length - 1 ? state.commitIndex + 1 : state.commitIndex;
    },
    saveView(state, action: PayloadAction<{ e: React.WheelEvent }>) {
      const { e } = action.payload;
      const { scale, prevMapX, prevMapY, originX, originY } = state.zoomInfo;
      const mapX = getMapX(e);
      const mapY = getMapY(e);
      const x = originX + (mapX - prevMapX) / scale;
      const y = originY + (mapY - prevMapY) / scale;
      const ZOOM_INTENSITY = 0.2;
      let newScale = scale * Math.exp((e.deltaY < 0 ? 1 : -1) * ZOOM_INTENSITY);
      if (newScale > 20) {
        newScale = 20;
      }
      if (newScale < 0.2) {
        newScale = 0.2;
      }
      state.zoomInfo.scale = newScale;
      state.zoomInfo.prevMapX = mapX;
      state.zoomInfo.prevMapY = mapY;
      state.zoomInfo.translateX = (mapX - x) / newScale;
      state.zoomInfo.translateY = (mapY - y) / newScale;
      state.zoomInfo.originX = x;
      state.zoomInfo.originY = y;
    },
    saveFromCoordinates(state, action: PayloadAction<{ e: React.MouseEvent }>) {
      const { e } = action.payload;
      const { scale, prevMapX, prevMapY, originX, originY } = state.zoomInfo;
      state.zoomInfo.fromX = originX + (getMapX(e) - prevMapX) / scale;
      state.zoomInfo.fromY = originY + (getMapY(e) - prevMapY) / scale;
    },
    offsetRByDragPreview(state, action: PayloadAction<{ r: R; e: MouseEvent }>) {
      const { r, e } = action.payload;
      const { fromX, fromY, scale, prevMapX, prevMapY, originX, originY } = state.zoomInfo;
      const toX = originX + (getMapX(e) - prevMapX) / scale - fromX + r.offsetW;
      const toY = originY + (getMapY(e) - prevMapY) / scale - fromY + r.offsetH;
      state.rOffsetCoords = [toX, toY, r.selfW, r.selfH];
    },
    insertL(state, { payload: { lPartial } }: PayloadAction<{ lPartial: Partial<L> }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapInsert.L(m, lPartial);
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    insertR(state, { payload: { controlType } }: PayloadAction<{ controlType: ControlType }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapInsert.R(m, controlType);
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    deleteL(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapDelete.L(m, nodeId);
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    deleteLR(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapDelete.LR(m, nodeId);
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    offsetLR(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      Object.assign(idToR(m, nodeId), {
        offsetW: state.rOffsetCoords[0],
        offsetH: state.rOffsetCoords[1],
      });
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
      state.rOffsetCoords = [];
    },
    setIsProcessing(
      state,
      { payload: { nodeId, isProcessing } }: PayloadAction<{ nodeId: string; isProcessing: boolean }>
    ) {
      updateRootProp(state, nodeId, { isProcessing });
    },
    setFileName(state, { payload: { nodeId, fileName } }: PayloadAction<{ nodeId: string; fileName: string }>) {
      updateRootProp(state, nodeId, { fileName });
    },
    setExtractionPrompt(
      state,
      { payload: { nodeId, extractionPrompt } }: PayloadAction<{ nodeId: string; extractionPrompt: string }>
    ) {
      updateRootProp(state, nodeId, { extractionPrompt });
    },
    setTextInput(state, { payload: { nodeId, textInput } }: PayloadAction<{ nodeId: string; textInput: string }>) {
      updateRootProp(state, nodeId, { textInput });
    },
    setNodeId(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      state.nodeId = nodeId;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(isAction, () => {});
    builder.addMatcher(
      isAnyOf(
        api.endpoints.toggleColorMode.matchPending,
        api.endpoints.selectMap.matchPending,
        api.endpoints.renameMap.matchPending,
        api.endpoints.createMapInTab.matchPending,
        api.endpoints.createMapInTabDuplicate.matchPending,
        api.endpoints.moveUpMapInTab.matchPending,
        api.endpoints.moveDownMapInTab.matchPending,
        api.endpoints.deleteMap.matchPending,
        api.endpoints.updateShareStatusAccepted.matchPending,
        api.endpoints.withdrawShare.matchPending,
        api.endpoints.rejectShare.matchPending,
        api.endpoints.deleteAccount.matchPending
      ),
      state => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(api.endpoints.signIn.matchFulfilled, (state, { payload }) => {
      state.pageState = PageState.WS;
      state.workspaceId = payload.workspaceId;
    });
    builder.addMatcher(api.endpoints.getUserInfo.matchFulfilled, state => {
      state.isLoading = false;
    });
    builder.addMatcher(api.endpoints.getMapInfo.matchFulfilled, (state, { payload }) => {
      console.log(payload);
      const isValid = Object.values(payload.mapData).every(obj => Object.keys(obj).includes('path'));
      if (isValid) {
        const m = structuredClone(mapObjectToArray(payload.mapData));
        mapBuild(m);
        state.mapId = payload.mapId;
        state.commitList = [m];
        state.commitIndex = 0;
        state.isLoading = false;
      } else {
        window.alert('invalid map');
      }
    });
    builder.addMatcher(api.endpoints.getSharesInfo.matchFulfilled, state => {
      state.isLoading = false;
    });
  },
});

export const { actions } = editorSlice;
