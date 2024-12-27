import { M, Side } from './mapState/MapStateTypes.ts';

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
  EXTRACTION_SHOW_RAW_PROMPT,
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

export interface EditorState {
  token: string;
  workspaceId: string;
  isLoading: boolean;
  midMouseMode: MidMouseMode;
  pageState: PageState;
  dialogState: DialogState;
  alertDialogState: AlertDialogState;
  mapId: string;
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
