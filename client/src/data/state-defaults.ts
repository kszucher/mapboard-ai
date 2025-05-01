import { Side } from '../../../shared/src/map/state/map-types.ts';
import { AlertDialogState, DialogState, MidMouseMode, PageState, State } from './state-types.ts';

export const stateDefaults: State = {
  token: '',
  workspaceId: 1,
  isLoading: false,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  commitList: [],
  commitIndex: 0,
  workspaceMap: {},
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

export const stateDefault = JSON.stringify(stateDefaults);
