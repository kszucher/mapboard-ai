import {GSaveAlways, GSaveNever, GSaveOptional, LSaveAlways, LSaveNever, LSaveOptional, PL, PT, TSaveAlways, TSaveNever, TSaveOptional} from "./MapStateTypes"
import {ControlTypes, LineTypes, Sides} from "./Enums"

export const gSaveAlways = {
  path: ['g'],
  nodeId: ''
} as GSaveAlways

export const gSaveOptional = {
  alignment: 'adaptive',
  density: 'large',
} as GSaveOptional

export const gSaveNever = {
  mapWidth: 0,
  mapHeight: 0,
  sLineDeltaXDefault: 0,
} as GSaveNever

export const lSaveAlways = {
  path: [] as unknown as PL,
  nodeId: '',
  fromNodeId: '',
  fromNodeSide: Sides.L,
  toNodeSide: Sides.R,
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
  controlType: ControlTypes.NONE,
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
  lineType: LineTypes.bezier,
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
  // mapMeasure
  selfW: 0,
  selfH: 0,
  familyW: 0,
  familyH: 0,
  maxColWidth: [],
  maxRowHeight: [],
  sumMaxColWidth: [0],
  sumMaxRowHeight: [0],
  maxW: 0,
  maxH: 0,
  spacing: 10,
  // mapPlace
  nodeStartX: 0,
  nodeEndX: 0,
  nodeStartY: 0,
  nodeEndY: 0,
  isTop: 0,
  isBottom: 0,
} as TSaveNever
