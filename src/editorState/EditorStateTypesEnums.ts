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

export enum NodeMode {
  VIEW = 'View',
  EDIT_LINE = 'Edit Line',
  EDIT_ROOT = 'Edit Root',
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
