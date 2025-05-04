import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WORKSPACE_EVENT } from '../../../../shared/src/api/api-types-distribution.ts';
import { MapInfo } from '../../../../shared/src/api/api-types-map.ts';
import {
  AcceptShareEvent,
  CreateShareEvent,
  ModifyShareAccessEvent,
  RejectShareEvent,
  WithdrawShareEvent,
} from '../../../../shared/src/api/api-types-share.ts';
import { api, useGetMapInfoQuery, useGetShareInfoQuery, useGetUserInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AccessType, AlertDialogState, DialogState, MidMouseMode, PageState } from '../../data/state-types.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { backendUrl } from '../../urls/Urls.ts';

export let timeoutId: NodeJS.Timeout;
let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const workspaceId = useSelector((state: RootState) => state.slice.workspaceId);
  const userId = useGetUserInfoQuery().data?.userInfo.id;
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const midMouseMode = useSelector((state: RootState) => state.slice.midMouseMode);
  const pageState = useSelector((state: RootState) => state.slice.pageState);
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.slice.alertDialogState);
  const commitList = useSelector((state: RootState) => state.slice.commitList);
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const mExists = m && Object.keys(m).length;
  const sharesWithUser = useGetShareInfoQuery().data?.shareInfo.SharesWithMe;
  const access = sharesWithUser?.find(el => el.id === mapId)?.access || AccessType.EDIT;
  const dispatch = useDispatch<AppDispatch>();

  const userIdRef = useRef(userId);
  const mapIdRef = useRef(mapId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    mapIdRef.current = mapId;
  }, [mapId]);

  const mouseup = () => {
    dispatch(actions.clearConnectionStart());
  };

  const contextmenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const wheel = (e: WheelEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (
      pageState === PageState.WS &&
      dialogState === DialogState.NONE &&
      alertDialogState === AlertDialogState.NONE &&
      access === AccessType.EDIT
    ) {
      console.log('WINDOW EVENT LISTENERS ADDED');
      mapListener = new AbortController();
      const { signal } = mapListener;
      window.addEventListener('mouseup', mouseup, { signal });
      window.addEventListener('contextmenu', contextmenu, { signal });
    } else {
      console.log('WINDOW EVENT LISTENERS REMOVED');
      if (mapListener) {
        mapListener.abort();
      }
    }
    return () => {
      if (mapListener) {
        mapListener.abort();
      }
    };
  }, [pageState, dialogState, alertDialogState, access]);

  useEffect(() => {
    if (midMouseMode === MidMouseMode.ZOOM) {
      console.log('MID MOUSE PREVENTION ADDED');
      midMouseListener = new AbortController();
      const { signal } = midMouseListener;
      window.addEventListener('wheel', wheel, { signal, passive: false });
    } else {
      console.log('MID MOUSE PREVENTION REMOVED');
      if (midMouseListener) {
        midMouseListener.abort();
      }
    }
    return () => {
      if (midMouseListener) {
        midMouseListener.abort();
      }
    };
  }, [midMouseMode]);

  useEffect(() => {
    if (mExists) {
      if (commitList.length > 1) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => mapId && dispatch(api.endpoints.saveMap.initiate({ mapId })), 250);
      }
    }
  }, [m]);

  useEffect(() => {
    if (workspaceId) {
      console.log('attempt to start event source with workspaceId: ', workspaceId);
      const eventSource = new EventSource(`${backendUrl}/workspace_events/${workspaceId}`);

      eventSource.onopen = () => {
        console.log('SSE open');
      };

      eventSource.onerror = error => {
        console.error('SSE error', error);
      };

      eventSource.addEventListener(WORKSPACE_EVENT.RENAME_MAP, e => {
        const data = JSON.parse(e.data);
        console.log(WORKSPACE_EVENT.RENAME_MAP, data);
        dispatch(api.util.invalidateTags(['MapInfo', 'TabInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.UPDATE_MAP_DATA, e => {
        const data = JSON.parse(e.data);
        console.log(WORKSPACE_EVENT.UPDATE_MAP_DATA, data);
        const mapInfo = data as { mapInfo: MapInfo };
        dispatch(actions.updateMapFromSSE(mapInfo));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.DELETE_MAP, e => {
        const data = JSON.parse(e.data);
        console.log(WORKSPACE_EVENT.DELETE_MAP, data);
        dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.UPDATE_TAB, e => {
        const data = JSON.parse(e.data);
        console.log(WORKSPACE_EVENT.UPDATE_TAB, data);
        dispatch(api.util.invalidateTags(['TabInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.CREATE_SHARE, e => {
        const data = JSON.parse(e.data) as CreateShareEvent;
        const toastMessage = `${data.OwnerUser.name} created share of map ${data.Map.name}`;
        console.log(WORKSPACE_EVENT.CREATE_SHARE, data, toastMessage);
        dispatch(api.util.invalidateTags(['ShareInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.ACCEPT_SHARE, e => {
        const data = JSON.parse(e.data) as AcceptShareEvent;
        const toastMessage = `${data.ShareUser.name} accepted share of map ${data.Map.name}`;
        console.log(WORKSPACE_EVENT.ACCEPT_SHARE, data, toastMessage);
        dispatch(api.util.invalidateTags(['ShareInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.WITHDRAW_SHARE, e => {
        const data = JSON.parse(e.data) as WithdrawShareEvent;
        const toastMessage = `${data.OwnerUser.name} withdrew share of map ${data.Map.name}`;
        console.log(WORKSPACE_EVENT.WITHDRAW_SHARE, data, toastMessage);
        if (data.shareUserId === userIdRef.current && data.mapId === mapIdRef.current) {
          dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
        }
        dispatch(api.util.invalidateTags(['ShareInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.REJECT_SHARE, e => {
        const data = JSON.parse(e.data) as RejectShareEvent;
        const toastMessage = `${data.ShareUser.name} rejected share of map ${data.Map.name}`;
        console.log(WORKSPACE_EVENT.REJECT_SHARE, data, toastMessage);
        if (data.shareUserId === userIdRef.current && data.mapId === mapIdRef.current) {
          dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
        }
        dispatch(api.util.invalidateTags(['ShareInfo']));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.MODIFY_SHARE_ACCESS, e => {
        const data = JSON.parse(e.data) as ModifyShareAccessEvent;
        const toastMessage = `${data.OwnerUser.name} changed access of map ${data.Map.name} to ${data.access}`;
        console.log(WORKSPACE_EVENT.MODIFY_SHARE_ACCESS, data, toastMessage);
        dispatch(api.util.invalidateTags(['ShareInfo']));
      });

      return () => {
        console.log('SSE close');
        eventSource.close();
      };
    }
  }, [workspaceId]);

  return <></>;
};
