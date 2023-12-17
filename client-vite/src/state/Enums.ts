export enum PageState {
  AUTH,
  WS,
}

export enum DialogState {
  NONE,
  SHARED_BY_ME,
  SHARED_WITH_ME,
  EDIT_CONTENT_EQUATION,
  EDIT_CONTENT_MERMAID,
  CREATE_TABLE,
  CREATE_MAP_IN_MAP,
  SHARE_THIS_MAP,
  RENAME_MAP
}

export enum AlertDialogState {
  NONE,
  DELETE_ACCOUNT
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
  w0 = 0,
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

export enum SubProcessTypes {
  NONE = '',
  INGESTION = 'ingestion',
  EXTRACTION = 'extraction'
}

export enum PlaceTypes {
  EXPLODED = 'exploded',
  INDENTED = 'indented'
}
