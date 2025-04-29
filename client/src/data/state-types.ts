import { MapInfo } from '../../../shared/src/api/api-types-map.ts';
import { ShareInfo } from '../../../shared/src/api/api-types-share.ts';
import { TabMapInfo } from '../../../shared/src/api/api-types-tab.ts';
import { UserInfo } from '../../../shared/src/api/api-types-user.ts';
import { M, Side } from '../../../shared/src/map/state/map-types.ts';

export interface State {
  token: string;
  workspaceId: number;
  isLoading: boolean;
  midMouseMode: MidMouseMode;
  pageState: PageState;
  dialogState: DialogState;
  alertDialogState: AlertDialogState;
  userInfo: UserInfo;
  mapInfo: MapInfo;
  tabMapInfo: TabMapInfo;
  shareInfo: ShareInfo;
  commitList: M[];
  commitIndex: number;
  rOffsetCoords: number[];
  zoomInfo: {
    fromX: number;
    fromY: number;
    scale: number;
    prevMapX: number;
    prevMapY: number;
    translateX: number;
    translateY: number;
    originX: number;
    originY: number;
  };
  linkHelpersVisible: boolean;
  rootFrameVisible: boolean;
  connectionStart: {
    fromNodeId: string;
    fromNodeSide: Side;
  };
  nodeId: string;
}

export enum PageState {
  AUTH,
  WS,
}

export enum DialogState {
  NONE,
  SHARED_BY_ME,
  SHARED_WITH_ME,
  SHARE_THIS_MAP,
  RENAME_MAP,
}

export enum AlertDialogState {
  NONE,
  DELETE_ACCOUNT,
}

export enum MidMouseMode {
  SCROLL = 'scroll',
  ZOOM = 'zoom',
}

export enum AccessType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

export enum StatusType {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
}
