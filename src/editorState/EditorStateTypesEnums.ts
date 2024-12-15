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

export enum LeftMouseMode {
  CLICK_SELECT = 'clickSelect',
  RECTANGLE_SELECT = 'rectangleSelect',
}

export enum MidMouseMode {
  SCROLL = 'scroll',
  ZOOM = 'zoom',
}

export enum AccessType {
  UNAUTHORIZED = 'unauthorized',
  VIEW = 'view',
  EDIT = 'edit',
}
