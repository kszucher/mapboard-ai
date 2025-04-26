import { ColorMode } from '../../../shared/src/api/api-types.ts';
import { AlertDialogState, DialogState, State, MidMouseMode, PageState } from './state-types.ts';
import { Side } from '../../../shared/src/map/state/map-types.ts';

export const stateDefaults: State = {
  token: '',
  workspaceId: 1,
  isLoading: false,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  userInfo: {
    name: '',
    colorMode: ColorMode.DARK,
  },
  mapInfo: {
    id: 1,
    name: '',
    data: {},
  },
  tabMapInfo: [],
  shareInfo: {
    SharesByMe: [],
    SharesWithMe: [],
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

export const stateDefault = JSON.stringify(stateDefaults);
