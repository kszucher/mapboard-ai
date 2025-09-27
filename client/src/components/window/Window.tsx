import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SSE_EVENT, SSE_EVENT_TYPE } from '../../../../shared/src/api/api-types-distribution.ts';
import { ShareAccess } from '../../../../shared/src/api/api-types-share.ts';
import { api, useGetMapInfoQuery, useGetShareInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AlertDialogState, DialogState, MidMouseMode, PageState } from '../../data/state-types.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { backendUrl } from '../../urls/Urls.ts';

let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const workspaceId = useSelector((state: RootState) => state.slice.workspaceId);
  const mapId = useGetMapInfoQuery().data?.id!;
  const midMouseMode = useSelector((state: RootState) => state.slice.midMouseMode);
  const pageState = useSelector((state: RootState) => state.slice.pageState);
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.slice.alertDialogState);
  const sharesWithUser = useGetShareInfoQuery().data?.SharesWithMe;
  const access = sharesWithUser?.find(el => el.id === mapId)?.access || ShareAccess.EDIT;
  const dispatch = useDispatch<AppDispatch>();

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
      access === ShareAccess.EDIT
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
          case SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH: {
            dispatch(actions.updateMapGraphSse(payload));
            break;
          }
          case SSE_EVENT_TYPE.INVALIDATE_SHARE: {
            dispatch(api.util.invalidateTags(['ShareInfo']));
            break;
          }
          case SSE_EVENT_TYPE.INVALIDATE_TAB: {
            dispatch(api.util.invalidateTags(['TabInfo']));
            break;
          }
          case SSE_EVENT_TYPE.INVALIDATE_MAP_TAB: {
            dispatch(api.util.invalidateTags(['MapInfo', 'TabInfo']));
            break;
          }
          case SSE_EVENT_TYPE.INVALIDATE_WORKSPACE_MAP_TAB_SHARE: {
            dispatch(api.endpoints.createWorkspace.initiate());
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
