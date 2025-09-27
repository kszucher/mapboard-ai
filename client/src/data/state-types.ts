import { M } from '../../../shared/src/api/api-types-map.ts';
import { ShareAccess } from '../../../shared/src/api/api-types-share.ts';

export interface State {
  token: string;
  workspaceId: number;
  isLoading: boolean;
  midMouseMode: MidMouseMode;
  pageState: PageState;
  dialogState: DialogState;
  alertDialogState: AlertDialogState;
  commitList: M[];
  commitIndex: number;
  mapShareAccess: ShareAccess;
  nodeOffsetCoords: number[];
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
  mapFrameVisible: boolean;
  connectionStart: {
    fromNodeId: number | null;
  };
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
