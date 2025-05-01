import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WORKSPACE_EVENT } from '../../../../shared/src/api/api-types-distribution.ts';
import { MapInfo } from '../../../../shared/src/api/api-types-map.ts';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { AccessType, AlertDialogState, DialogState, MidMouseMode, PageState } from '../../data/state-types.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { backendUrl } from '../../urls/Urls.ts';

export let timeoutId: NodeJS.Timeout;
let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const workspaceId = useSelector((state: RootState) => state.slice.workspaceId);
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const midMouseMode = useSelector((state: RootState) => state.slice.midMouseMode);
  const pageState = useSelector((state: RootState) => state.slice.pageState);
  const dialogState = useSelector((state: RootState) => state.slice.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.slice.alertDialogState);
  const commitList = useSelector((state: RootState) => state.slice.commitList);
  const m = useSelector((state: RootState) => state.slice.commitList[state.slice.commitIndex]);
  const mExists = m && Object.keys(m).length;
  const sharesWithUser = useSelector((state: RootState) => state.slice.shareInfo.SharesWithMe);
  const access = sharesWithUser.find(el => el.id === mapId)?.access || AccessType.EDIT;
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
        timeoutId = setTimeout(() => mapId && dispatch(api.endpoints.saveMap.initiate({ mapId })), 400);
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

      eventSource.addEventListener(WORKSPACE_EVENT.MAP_RENAMED, e => {
        console.log('map renames sse trigger');
        dispatch(api.util.invalidateTags(['MapInfo', 'TabInfo']));
        console.log('payload:', JSON.parse(e.data));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.MAP_DATA_UPDATED, e => {
        const mapInfo = JSON.parse(e.data) as { mapInfo: MapInfo };
        dispatch(actions.updateMapFromSSE(mapInfo));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.SHARE_CREATED, e => {
        console.log('payload:', JSON.parse(e.data));
      });

      eventSource.addEventListener(WORKSPACE_EVENT.SHARE_RECEIVED, e => {
        console.log('payload:', JSON.parse(e.data));
      });

      return () => {
        console.log('SSE close');
        eventSource.close();
      };
    }
  }, [workspaceId]);

  return <></>;
};
