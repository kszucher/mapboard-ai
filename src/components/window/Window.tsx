import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AccessType,
  AlertDialogState,
  DialogState,
  MidMouseMode,
  PageState,
} from '../../data/clientSide/EditorStateTypes.ts';
import { api } from '../../data/serverSide/Api.ts';
import { sharesInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { backendUrl } from '../../urls/Urls.ts';

export let timeoutId: NodeJS.Timeout;
let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const workspaceId = useSelector((state: RootState) => state.editor.workspaceId);
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode);
  const pageState = useSelector((state: RootState) => state.editor.pageState);
  const dialogState = useSelector((state: RootState) => state.editor.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState);
  const commitList = useSelector((state: RootState) => state.editor.commitList);
  const m = useSelector((state: RootState) => state.editor.commitList[state.editor.commitIndex]);
  const mExists = m && Object.keys(m).length;
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
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
        timeoutId = setTimeout(() => dispatch(api.endpoints.saveMap.initiate()), 200);
      }
    }
  }, [m]);

  useEffect(() => {
    if (workspaceId) {
      const eventSource = new EventSource(backendUrl + '/workspace_updates/?workspace_id=' + workspaceId);
      eventSource.onmessage = event => {
        console.log('SSE data:', event.data);
        const eventData = JSON.parse(event.data.replace(/'/g, '"'));
        switch (eventData.event_id) {
          case 'MAP_UPDATED':
            dispatch(api.util.invalidateTags(['MapInfo']));
            break;
          case 'MAP_DELETED':
            // TODO select_available_map
            break;
        }
      };
      return () => eventSource.close();
    }
  }, [workspaceId]);

  return <></>;
};
