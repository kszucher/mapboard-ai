import { createSlice, current, isAction, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { MapInfo } from '../../../shared/src/api/api-types-map.ts';
import { mapAlign } from '../../../shared/src/map/setters/map-align.ts';
import { mapDelete } from '../../../shared/src/map/setters/map-delete.ts';
import { mapInsert } from '../../../shared/src/map/setters/map-insert.ts';
import { ControlType, L, R, Side } from '../../../shared/src/map/state/map-types.ts';
import { jsonDiff } from '../../../shared/src/map/utils/json-diff.ts';
import { jsonMerge } from '../../../shared/src/map/utils/json-merge.ts';
import { getMapX, getMapY } from '../components/map/UtilsDiv.ts';
import { genId } from '../utils/utils.ts';
import { api } from './api.ts';
import { stateDefault, stateDefaults } from './state-defaults.ts';
import { AlertDialogState, DialogState, MidMouseMode, PageState, State } from './state-types.ts';

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
      mapInsert.L(m, lPartial, genId);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    insertR(state, { payload: { controlType } }: PayloadAction<{ controlType: ControlType }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapInsert.R(m, controlType, genId);
      mapAlign(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    deleteL(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapDelete.L(m, nodeId);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    deleteLR(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      mapDelete.LR(m, nodeId);
      mapAlign(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    offsetLR(state, { payload: { nodeId } }: PayloadAction<{ nodeId: string }>) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      Object.assign(m.r[nodeId], {
        offsetW: state.rOffsetCoords[0],
        offsetH: state.rOffsetCoords[1],
      });
      mapAlign(m);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
      state.rOffsetCoords = [];
    },
    setRAttributes(
      state,
      { payload: { nodeId, attributes } }: PayloadAction<{ nodeId: string; attributes: Partial<R> }>
    ) {
      const m = structuredClone(current(state.commitList[state.commitIndex]));
      Object.assign(m.r[nodeId], attributes);
      state.commitList = [...state.commitList.slice(0, state.commitIndex + 1), m];
      state.commitIndex = state.commitIndex + 1;
    },
    updateMapFromSSE(state, { payload }: PayloadAction<{ mapInfo: MapInfo }>) {
      console.log('map updated from server...');
      const newServerMap = payload.mapInfo.data;
      const clientMap = current(state.commitList[state.commitIndex]);
      const serverMap = current(state.serverMap);
      const newClientMap = jsonMerge(clientMap, jsonDiff(newServerMap, serverMap));
      state.commitList = [newClientMap];
      state.commitIndex = 0;
      state.serverMap = newServerMap;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(isAction, () => {});
    builder.addMatcher(api.endpoints.createWorkspace.matchFulfilled, (state, { payload }) => {
      state.workspaceId = payload.workspaceInfo.workspaceId;
      state.pageState = PageState.WS;
    });
    builder.addMatcher(
      isAnyOf(
        api.endpoints.toggleColorMode.matchPending,
        api.endpoints.createMapInTab.matchPending,
        api.endpoints.createMapInTabDuplicate.matchPending,
        api.endpoints.updateWorkspaceMap.matchPending,
        api.endpoints.renameMap.matchPending,
        api.endpoints.moveUpMapInTab.matchPending,
        api.endpoints.moveDownMapInTab.matchPending,
        api.endpoints.deleteMap.matchPending,
        api.endpoints.createShare.matchPending,
        api.endpoints.acceptShare.matchPending,
        api.endpoints.withdrawShare.matchPending,
        api.endpoints.rejectShare.matchPending,
        api.endpoints.modifyShareAccess.matchPending,
        api.endpoints.deleteAccount.matchPending
      ),
      state => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(api.endpoints.getMapInfo.matchFulfilled, (state, { payload }) => {
      console.log(payload.mapInfo);
      const isValid = true;
      if (isValid) {
        const m = structuredClone(payload.mapInfo.data);
        state.commitList = [m];
        state.commitIndex = 0;
        state.serverMap = payload.mapInfo.data;
      } else {
        window.alert('invalid map');
      }
    });
    builder.addMatcher(
      isAnyOf(
        api.endpoints.getUserInfo.matchFulfilled,
        api.endpoints.getMapInfo.matchFulfilled,
        api.endpoints.getTabInfo.matchFulfilled,
        api.endpoints.getShareInfo.matchFulfilled
      ),
      state => {
        state.isLoading = false;
      }
    );
  },
});

export const { actions } = slice;
