export enum PageState {
  AUTH,
  DEMO,
  WS,
  WS_PROFILE,
  WS_SETTINGS,
  WS_SHARED_BY_ME,
  WS_SHARED_WITH_ME,
  WS_EDIT_CONTENT_EQUATION,
  WS_EDIT_CONTENT_MERMAID,
  WS_CREATE_TABLE,
  WS_CREATE_MAP_IN_MAP,
  WS_SHARE_THIS_MAP,
  WS_LOADING,
  WS_RENAME_MAP
}

export enum AccessTypes {
  UNAUTHORIZED = 'unauthorized',
  VIEW = 'view',
  EDIT = 'edit'
}

export enum FormatMode {
  text,
  sBorder,
  fBorder,
  sFill,
  fFill,
  line
}

export enum TextTypes {
  h1 = 36,
  h2 = 24,
  h3 = 18,
  h4 = 16,
  t = 14
}

export enum WidthTypes {
  w1 = 1,
  w2,
  w3
}

export enum LineTypes {
  bezier,
  edge
}

export enum Sides {
  L = 'left',
  R = 'right',
  T = 'top',
  B = 'bottom',
}

export enum ControlTypes {
  NONE = '',
  INGESTION = 'ingestion',
  EXTRACTION = 'extraction',
}
