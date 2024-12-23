import { Side } from '../mapState/MapStateTypesEnums.ts';
import { EditorState } from './EditorStateTypes.ts';
import { AlertDialogState, DialogState, MidMouseMode, PageState } from './EditorStateTypesEnums.ts';

export const editorState: EditorState = {
  token: '',
  workspaceId: '',
  isLoading: false,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  mapId: '',
  commitList: [],
  commitIndex: 0,
  formatterVisible: false,
  rOffsetCoords: [],
  zoomInfo: {
    fromX: 0,
    fromY: 0,
    scale: 1,
    prevMapX: 0,
    prevMapY: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0,
  },
  connectionHelpersVisible: false,
  connectionStart: {
    fromNodeId: '',
    fromNodeSide: Side.R,
  },
};

export const editorStateDefault = JSON.stringify(editorState);
