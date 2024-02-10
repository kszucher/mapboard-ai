import {ControlType, LineType, Flow, Side} from "./Enums"
import {GSaveAlways, GSaveNever, GSaveOptional, LSaveAlways, LSaveNever, LSaveOptional, PL, PT, TSaveAlways, TSaveNever, TSaveOptional} from "./MapStateTypes"

export const gSaveAlways = {
  path: ['g'],
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

export const tSaveAlways = {
  path: [] as unknown as PT,
  nodeId: '',
} as TSaveAlways

export const tSaveOptional = {
  controlType: ControlType.NONE,
  offsetW: 0,
  offsetH: 0,
  llmDataType: 'text',
  llmDataId: '',
  note: '',
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
} as TSaveOptional

export const tSaveNever = {
  // mapChain
  tsi1: '',
  tsi2: '',
  tso1: [],
  tso2: [],
  tco1: [],
  tco2: [],
  tsu: [],
  // mapMeasure
  selfW: 0,
  selfH: 0,
  familyW: 0,
  familyH: 0,
  maxW: 0,
  maxH: 0,
  calcOffsetX: 0,
  calcOffsetY: 0,
  // mapPlaceIndented
  nodeStartX: 0,
  nodeStartY: 0,
  isTop: 0,
  isBottom: 0,
} as TSaveNever
