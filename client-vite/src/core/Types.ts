export enum AuthPageState {
  SIGN_IN,
  SIGN_UP_STEP_1,
  SIGN_UP_STEP_2
}

export enum PageState {
  AUTH,
  DEMO,
  WS,
  WS_PROFILE,
  WS_SETTINGS,
  WS_SHARES,
  WS_CREATE_TABLE,
  WS_CREATE_TASK,
  WS_CREATE_MAP_IN_MAP,
  WS_SHARE_THIS_MAP,
}

export enum MapRight {
  UNAUTHORIZED,
  VIEW,
  EDIT
}

export enum FormatMode {
  text,
  border,
  fill,
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

export enum Dir {
  I,
  IR,
  IL,
  O,
  OR,
  OL,
  U,
  D,
}
