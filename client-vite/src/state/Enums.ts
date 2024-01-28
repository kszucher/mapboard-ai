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
  RENAME_MAP,
  ROOT_INGESTION,
  ROOT_EXTRACTION
}

export enum AlertDialogState {
  NONE,
  DELETE_ACCOUNT
}

export enum LeftMouseMode {
  SELECT_BY_RECTANGLE = 'selectByRectangle',
  SELECT_BY_CLICK_OR_MOVE = 'selectByClickOrMove'
}

export enum MidMouseMode {
  SCROLL = 'scroll',
  ZOOM = 'zoom'
}

export enum AccessType {
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

export enum TextType {
  h1 = 36,
  h2 = 24,
  h3 = 18,
  h4 = 16,
  t = 14
}

export enum WidthType {
  w0 = 0,
  w1 = 1,
  w2,
  w3
}

export enum LineType {
  bezier,
  edge
}

export enum Side {
  L = 'left',
  R = 'right',
  T = 'top',
  B = 'bottom',
}

export enum ControlType {
  NONE = '',
  INGESTION = 'ingestion',
  EXTRACTION = 'extraction',
}

export enum SubProcessType {
  INGESTION = 'ingestion',
  EXTRACTION = 'extraction'
}

export enum Flow {
  EXPLODED = 'exploded',
  INDENTED = 'indented'
}
