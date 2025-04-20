import { ColorMode } from '../../../../../shared/types/api-state-types.ts';
import { AlertDialogState, DialogState, EditorState, MidMouseMode, PageState } from './editor-state-types.ts';
import { Side } from '../mapState/map-state-types.ts';

export const editorStateDefaults: EditorState = {
  token: '',
  workspaceId: 1,
  isLoading: false,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  userInfo: {
    userName: '',
    colorMode: ColorMode.DARK,
    tabMapIdList: [],
    tabMapNameList: [],
  },
  mapInfo: {
    id: 1,
    name: '',
    mapData: {},
  },
  shareInfo: {
    sharesWithUser: [],
    sharesByUser: [],
  },
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
  nodeId: '',
};

export const editorStateDefault = JSON.stringify(editorStateDefaults);
