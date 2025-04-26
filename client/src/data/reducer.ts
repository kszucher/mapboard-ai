import { createSlice, current, isAction, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { MapInfo } from '../../../shared/src/api/api-types.ts';
import { getMapX, getMapY } from '../components/map/UtilsDiv.ts';
import { api } from './api.ts';
import { stateDefault, stateDefaults } from './state-defaults.ts';
import { AlertDialogState, DialogState, State, MidMouseMode, PageState } from './state-types.ts';
import { idToR, mapObjectToArray } from '../../../shared/src/map/getters/map-queries.ts';
import { mapBuild } from '../../../shared/src/map/setters/map-build.ts';
import { mapDelete } from '../../../shared/src/map/setters/map-delete.ts';
import { mapInsert } from '../../../shared/src/map/setters/map-insert.ts';
import { ControlType, L, R, Side } from '../../../shared/src/map/state/map-types.ts';

export const slice = createSlice({
  name: 'slice',
  initialState: stateDefaults,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    resetState() {
      return JSON.parse(stateDefault);
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
    setZoomInfo(state, action: PayloadAction<Omit<State['zoomInfo'], 'fromX' | 'fromY'>>) {
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
    setConnectionStart(state, action: PayloadAction<State['connectionStart']>) {
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
    setRAttributes(
      state,
      { payload: { nodeId, attributes } }: PayloadAction<{ nodeId: string; attributes: Partial<R> }>
    ) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      Object.assign(idToR(m, nodeId), attributes);
      mapBuild(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
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
        api.endpoints.createMapInTab.matchPending,
        api.endpoints.createMapInTabDuplicate.matchPending,
        api.endpoints.updateWorkspace.matchPending,
        api.endpoints.renameMap.matchPending,
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
    builder.addMatcher(api.endpoints.createWorkspace.matchFulfilled, (state, { payload }) => {
      state.pageState = PageState.WS;
      state.workspaceId = payload.workspaceId;
      state.userInfo = payload.userInfo;
      state.tabMapInfo = payload.tabMapInfo;
      state.shareInfo = payload.shareInfo;
      const readMapSuccess = readMap(state, payload.mapInfo);
      if (readMapSuccess) {
        state.isLoading = false;
      }
    });
    builder.addMatcher(api.endpoints.createMapInTab.matchFulfilled, (state, { payload }) => {
      state.tabMapInfo = payload.tabMapInfo;
      const readMapSuccess = readMap(state, payload.mapInfo);
      if (readMapSuccess) {
        state.isLoading = false;
      }
    });
    builder.addMatcher(api.endpoints.renameMap.matchFulfilled, (state, { payload }) => {
      state.mapInfo.name = payload.mapInfo.name;
      state.isLoading = false;
    });
    builder.addMatcher(api.endpoints.updateWorkspace.matchFulfilled, (state, { payload }) => {
      const readMapSuccess = readMap(state, payload.mapInfo);
      if (readMapSuccess) {
        state.isLoading = false;
      }
    });
  },
});

const readMap = (state: State, payload: MapInfo): boolean => {
  console.log(payload);
  const isValid = Object.values(payload.data).every(obj => Object.keys(obj as object).includes('path'));
  if (isValid) {
    const m = structuredClone(mapObjectToArray(payload.data));
    mapBuild(m);
    state.mapInfo.id = payload.id;
    state.mapInfo.name = payload.name;
    state.commitList = [m];
    state.commitIndex = 0;
    return true;
  } else {
    window.alert('invalid map');
    return false;
  }
};

export const { actions } = slice;
