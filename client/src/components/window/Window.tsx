import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SSE_EVENT, SSE_EVENT_TYPE } from '../../../../shared/src/api/api-types-distribution.ts';
import { api, useGetMapInfoQuery, useGetShareInfoQuery, useGetUserInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AccessType, AlertDialogState, DialogState, MidMouseMode, PageState } from '../../data/state-types.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { backendUrl } from '../../urls/Urls.ts';

let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const workspaceId = useSelector((state: RootState) => state.slice.workspaceId);
  const userId = useGetUserInfoQuery().data?.userInfo.id;
  const mapId = useGetMapInfoQuery().data?.id!;
  const midMouseMode = useSelector((state: RootState) => state.slice.midMouseMode);
  const pageState = useSelector((state: RootState) => state.slice.pageState);
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.slice.alertDialogState);
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
    if (workspaceId) {
      console.log('attempt to start event source with workspaceId: ', workspaceId);
      const eventSource = new EventSource(`${backendUrl}/workspace_events/${workspaceId}`);

      eventSource.onopen = () => {
        console.log('SSE open');
      };

      eventSource.onerror = error => {
        console.error('SSE error', error);
      };

      eventSource.addEventListener('message', e => {
        const { type, payload } = JSON.parse(e.data) as SSE_EVENT;
        switch (type) {
          case SSE_EVENT_TYPE.RENAME_MAP: {
            dispatch(api.util.invalidateTags(['MapInfo', 'TabInfo']));
            break;
          }
          case SSE_EVENT_TYPE.DELETE_MAP: {
            if (payload.mapId === mapIdRef.current) {
              dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
            }
            dispatch(api.util.invalidateTags(['TabInfo']));
            break;
          }
          case SSE_EVENT_TYPE.INSERT_NODE: {
            dispatch(actions.insertNode(payload));
            break;
          }
          case SSE_EVENT_TYPE.INSERT_LINK: {
            dispatch(actions.insertLink(payload));
            break;
          }
          case SSE_EVENT_TYPE.DELETE_NODE: {
            dispatch(actions.deleteNode(payload));
            break;
          }
          case SSE_EVENT_TYPE.DELETE_LINK: {
            dispatch(actions.deleteLink(payload));
            break;
          }
          case SSE_EVENT_TYPE.MOVE_NODE: {
            dispatch(actions.moveNode(payload));
            break;
          }
          case SSE_EVENT_TYPE.UPDATE_NODE: {
            dispatch(actions.updateNode(payload));
            break;
          }
          case SSE_EVENT_TYPE.UPDATE_NODES: {
            dispatch(actions.updateNodes(payload));
            break;
          }
          case SSE_EVENT_TYPE.UPDATE_TAB: {
            dispatch(api.util.invalidateTags(['TabInfo']));
            break;
          }
          case SSE_EVENT_TYPE.CREATE_SHARE: {
            const toastMessage = `${payload.OwnerUser.name} created share of map ${payload.Map.name}`;
            console.log(toastMessage);
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
          case SSE_EVENT_TYPE.ACCEPT_SHARE: {
            const toastMessage = `${payload.ShareUser.name} accepted share of map ${payload.Map.name}`;
            console.log(toastMessage);
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
          case SSE_EVENT_TYPE.WITHDRAW_SHARE: {
            const toastMessage = `${payload.OwnerUser.name} withdrew share of map ${payload.Map.name}`;
            console.log(toastMessage);
            if (payload.shareUserId === userIdRef.current && payload.mapId === mapIdRef.current) {
              dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
            }
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
          case SSE_EVENT_TYPE.REJECT_SHARE: {
            const toastMessage = `${payload.ShareUser.name} rejected share of map ${payload.Map.name}`;
            console.log(toastMessage);
            if (payload.shareUserId === userIdRef.current && payload.mapId === mapIdRef.current) {
              dispatch(api.endpoints.updateWorkspaceMap.initiate({ mapId: null }));
            }
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
          case SSE_EVENT_TYPE.MODIFY_SHARE_ACCESS: {
            const toastMessage = `${payload.OwnerUser.name} changed access of map ${payload.Map.name} to ${payload.access}`;
            console.log(toastMessage);
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
        }
      });

      return () => {
        console.log('SSE close');
        eventSource.close();
      };
    }
  }, [workspaceId]);

  return <></>;
};
