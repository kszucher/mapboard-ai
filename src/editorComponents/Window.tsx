import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defaultUseOpenWorkspaceQueryState } from '../apiState/ApiState.ts';
import { actions } from '../editorMutations/EditorMutations.ts';
import { getMap, mSelector } from '../editorQueries/EditorQueries.ts';
import {
  AccessType,
  AlertDialogState,
  DialogState,
  MidMouseMode,
  PageState,
} from '../editorState/EditorStateTypesEnums.ts';
import { mapMutationsConditions } from '../mapMutations/MapMutationsConditions.ts';
import { isAXR } from '../mapQueries/MapQueries.ts';
import { api, AppDispatch, RootState, useOpenWorkspaceQuery } from '../rootComponent/RootComponent.tsx';
import { backendUrl } from '../urls/Urls.ts';

export let timeoutId: NodeJS.Timeout;
let mapListener: AbortController;
let midMouseListener: AbortController;

export const Window: FC = () => {
  const workspaceId = useSelector((state: RootState) => state.editor.workspaceId);
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode);
  const pageState = useSelector((state: RootState) => state.editor.pageState);
  const dialogState = useSelector((state: RootState) => state.editor.dialogState);
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState);
  const commitList = useSelector((state: RootState) => state.editor.commitList);
  const m = useSelector((state: RootState) => mSelector(state));
  const mExists = m && Object.keys(m).length;
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId);
  const { data } = useOpenWorkspaceQuery();
  const { access } = data || defaultUseOpenWorkspaceQueryState;
  const dispatch = useDispatch<AppDispatch>();
  const keydown = (e: KeyboardEvent) => {
    if (
      (+e.ctrlKey && e.code === 'KeyD') ||
      (+e.ctrlKey && e.code === 'KeyZ') ||
      (+e.ctrlKey && e.code === 'KeyY') ||
      (+e.ctrlKey && e.which >= 96 && e.which <= 105) ||
      e.which < 48 ||
      e.key === 'F1' ||
      e.key === 'F3'
    ) {
      e.preventDefault();
    }
    const m = getMap();
    const ckm = [+e.ctrlKey ? 'c' : '-', +e.shiftKey ? 's' : '-', +e.altKey ? 'a' : '-'].join('');

    if (ckm === '---' && e.key === 'Delete' && mapMutationsConditions.deleteLR(m)) dispatch(actions.deleteLR());

    if (ckm === '---' && e.code === 'Space' && mapMutationsConditions.selectR0(m)) dispatch(actions.selectR0());

    if (ckm === '---' && e.code === 'Backspace' && mapMutationsConditions.unselect(m)) dispatch(actions.unselect());

    if (ckm === 'c--' && e.code === 'KeyA' && mapMutationsConditions.selectRA(m)) dispatch(actions.selectRA());

    if (ckm === 'c--' && e.code === 'KeyC' && mapMutationsConditions.copyLR(m)) dispatch(actions.copyLR());

    if (ckm === 'c--' && e.code === 'KeyX' && mapMutationsConditions.cutLRJumpR(m)) dispatch(actions.cutLRJumpR());

    if (ckm === 'c--' && e.code === 'KeyD' && mapMutationsConditions.duplicateLR(m)) dispatch(actions.duplicateLR());

    if (ckm === 'c--' && e.code === 'KeyZ') dispatch(actions.redo());

    if (ckm === 'c--' && e.code === 'KeyY') dispatch(actions.undo());

    if (ckm === '---' && e.code === 'ArrowDown' && mapMutationsConditions.selectRDR(m)) dispatch(actions.selectRDR());
    if (ckm === 'c--' && e.code === 'ArrowDown' && mapMutationsConditions.offsetD(m)) dispatch(actions.offsetD());
    if (ckm === '-s-' && e.code === 'ArrowDown' && mapMutationsConditions.selectRDRAdd(m))
      dispatch(actions.selectRDRAdd());
    if (ckm === '--a' && e.code === 'ArrowDown' && mapMutationsConditions.insertRD(m)) dispatch(actions.insertRD());

    if (ckm === '---' && e.code === 'ArrowUp' && mapMutationsConditions.selectRUR(m)) dispatch(actions.selectRUR());
    if (ckm === 'c--' && e.code === 'ArrowUp' && mapMutationsConditions.offsetU(m)) dispatch(actions.offsetU());
    if (ckm === '-s-' && e.code === 'ArrowUp' && mapMutationsConditions.selectRURAdd(m))
      dispatch(actions.selectRURAdd());
    if (ckm === '--a' && e.code === 'ArrowUp' && mapMutationsConditions.insertRU(m)) dispatch(actions.insertRU());

    if (ckm === '---' && e.code === 'ArrowRight' && mapMutationsConditions.selectRRR(m)) dispatch(actions.selectRRR());
    if (ckm === 'c--' && e.code === 'ArrowRight' && mapMutationsConditions.offsetR(m)) dispatch(actions.offsetR());
    if (ckm === '-s-' && e.code === 'ArrowRight' && mapMutationsConditions.selectRRRAdd(m))
      dispatch(actions.selectRRRAdd());
    if (ckm === '--a' && e.code === 'ArrowRight' && mapMutationsConditions.insertRR(m)) dispatch(actions.insertRR());

    if (ckm === '---' && e.code === 'ArrowLeft' && mapMutationsConditions.selectRLR(m)) dispatch(actions.selectRLR());
    if (ckm === 'c--' && e.code === 'ArrowLeft' && mapMutationsConditions.offsetL(m)) dispatch(actions.offsetL());
    if (ckm === '-s-' && e.code === 'ArrowLeft' && mapMutationsConditions.selectRLRAdd(m))
      dispatch(actions.selectRLRAdd());
    if (ckm === '--a' && e.code === 'ArrowLeft' && mapMutationsConditions.insertRL(m)) dispatch(actions.insertRL());
  };

  const paste = (e: Event) => {
    e.preventDefault();
    const m = getMap();
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.read().then(item => {
          const type = item[0].types[0];
          if (type === 'text/plain') {
            navigator.clipboard.readText().then(text => {
              let isValidJson = true;
              try {
                JSON.parse(text);
              } catch {
                isValidJson = false;
              }
              if (isValidJson) {
                const mapJson = JSON.parse(text);
                const isValidMap =
                  Array.isArray(mapJson) &&
                  mapJson.length &&
                  mapJson.every(
                    el =>
                      Object.hasOwn(el, 'path') &&
                      Array.isArray(el.path) &&
                      Object.hasOwn(el, 'nodeId') &&
                      typeof el.nodeId === 'string'
                  );
                if (isValidMap) {
                  const isPastedLR = mapJson.every(el => ['r', 'l'].includes(el.path[0]));
                  if (isAXR(m)) {
                    if (isPastedLR) dispatch(actions.pasteLR(text));
                  } else {
                    if (isPastedLR) dispatch(actions.pasteLR(text));
                  }
                } else {
                  window.alert('invalid componentsMap');
                }
              }
            });
          }
        });
      }
    });
  };

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
      access === AccessType.EDIT &&
      editedNodeId === ''
    ) {
      console.log('WINDOW EVENT LISTENERS ADDED');
      mapListener = new AbortController();
      const { signal } = mapListener;
      window.addEventListener('keydown', keydown, { signal });
      window.addEventListener('paste', paste, { signal });
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
  }, [pageState, dialogState, alertDialogState, access, editedNodeId]);

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
        timeoutId = setTimeout(() => dispatch(api.endpoints.saveMap.initiate()), 100);
      }
    }
  }, [m]);

  useEffect(() => {
    if (workspaceId) {
      const eventSource = new EventSource(backendUrl + '/workspace_updates/?workspace_id=' + workspaceId);
      eventSource.onmessage = event => {
        console.log('SSE data:', event.data);
        // dispatch(api.endpoints.selectMap.initiate({workspaceId}))
        switch (event.data) {
          case 'MAP_UPDATED':
            // dispatch(api.util.invalidateTags(['Workspace']))
            break;
          case 'MAP_DELETED':
            break;
        }
      };
      return () => eventSource.close();
    }
  }, [workspaceId]);

  return <></>;
};
