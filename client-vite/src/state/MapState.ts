import {ControlType, LineType, Flow, Side} from "./Enums"
import {PG, PL, PR, PS, PC, GSaveAlways, GSaveNever, GSaveOptional, LSaveAlways, LSaveNever, LSaveOptional, RSaveAlways, RSaveNever, RSaveOptional, SSaveAlways, SSaveNever, SSaveOptional, CSaveAlways, CSaveNever, CSaveOptional,} from "./MapStateTypes"

export const gSaveAlways = {
  path: ['g'] as PG,
  nodeId: ''
} as GSaveAlways

export const gSaveOptional = {
  density: 'large',
  flow: Flow.EXPLODED
} as GSaveOptional

export const gSaveNever = {
  selfW: 0,
  selfH: 0,
  sLineDeltaXDefault: 0,
} as GSaveNever

export const lSaveAlways = {
  path: [] as unknown as PL,
  nodeId: '',
  fromNodeId: '',
  fromNodeSide: Side.L,
  toNodeSide: Side.R,
  toNodeId: '',
} as LSaveAlways

export const lSaveOptional = {
  lineColor: '#bbbbbb',
  lineWidth: 1,
} as LSaveOptional

export const lSaveNever = {

} as LSaveNever

export const rSaveAlways = {
  path: [] as unknown as PR,
  nodeId: '',
} as RSaveAlways

export const rSaveOptional = {
  controlType: ControlType.NONE,
  offsetW: 0,
  offsetH: 0,
  note: '',
  ingestionHash: '',
  extractionHash: '',
  selected: 0,
  lastSelectedChild: -1,
} as RSaveOptional

export const rSaveNever = {
  so1: [],
  so: [],
  co: [],
  selfW: 0,
  selfH: 0,
  maxW: 0,
  maxH: 0,
  familyW: 0,
  familyH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
} as RSaveNever

export const sSaveAlways = {
  path: [] as unknown as PS,
  nodeId: '',
} as SSaveAlways

export const sSaveOptional = {
  contentType: 'text',
  content: '',
  linkType: '',
  link: '',
  imageW: 0,
  imageH: 0,
  dimW: 0,
  dimH: 0,
  selected: 0,
  selection: 's',
  lastSelectedChild: -1,
  lineWidth: 1,
  lineType: LineType.bezier,
  lineColor: '#bbbbbb',
  sBorderWidth: 0,
  fBorderWidth: 0,
  sBorderColor: '',
  fBorderColor: '',
  sFillColor: '',
  fFillColor: '',
  textFontSize: 14,
  textColor: 'default',
  taskStatus: 0,
  blur: 0,
} as SSaveOptional

export const sSaveNever = {
  ri1: '',
  si1: '',
  ci1: '',
  so1: [],
  so: [],
  co1: [],
  co: [],
  su: [],
  sd: [],
  rowCount: 0,
  colCount: 0,
  isTop: 0,
  isBottom: 0,
  selfW: 0,
  selfH: 0,
  familyW: 0,
  familyH: 0,
  maxW: 0,
  maxH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
} as SSaveNever

export const cSaveAlways = {
  path: [] as unknown as PC,
  nodeId: '',
} as CSaveAlways

export const cSaveOptional = {
  dimW: 0,
  dimH: 0,
  selected: 0,
  lastSelectedChild: -1,
  lineWidth: 1,
  lineType: LineType.bezier,
  lineColor: '#bbbbbb',
} as CSaveOptional

export const cSaveNever = {
  ri2: '',
  si1: '',
  si2: '',
  so1: [],
  so: [],
  cu: [],
  cd: [],
  cv: [],
  cl: [],
  cr: [],
  ch: [],
  selfW: 0,
  selfH: 0,
  familyW: 0,
  familyH: 0,
  maxW: 0,
  maxH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
} as CSaveNever
