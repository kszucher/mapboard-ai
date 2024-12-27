import { Side } from './mapState/MapStateTypesEnums.ts';
import { AlertDialogState, DialogState, EditorState, MidMouseMode, PageState } from './EditorStateTypes.ts';

export const editorStateDefaults: EditorState = {
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
  linkHelpersVisible: false,
  rootFrameVisible: false,
  connectionStart: {
    fromNodeId: '',
    fromNodeSide: Side.R,
  },
};

export const editorStateDefault = JSON.stringify(editorStateDefaults);
