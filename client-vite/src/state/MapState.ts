import {GSaveAlways, GSaveNever, GSaveOptional, NSaveAlways, NSaveNever, NSaveOptional} from "./MapStateTypes"
import {ControlTypes, LineTypes} from "./Enums"

export const gSaveAlways = {
  path: ['g'],
  nodeId: ''
} as GSaveAlways

export const gSaveOptional = {
  alignment: 'adaptive',
  density: 'large',
  connections: [],
} as GSaveOptional

export const gSaveNever = {
  mapWidth: 0,
  mapHeight: 0,
  maxD: 0,
  maxU: 0,
  maxR: 0,
  maxL: 0,
  sLineDeltaXDefault: 0,
} as GSaveNever

export const nSaveAlways = {
  path: [],
  nodeId: '',
} as NSaveAlways

export const nSaveOptional = {
  controlType: ControlTypes.NONE,
  contentType: 'text',
  content: '',
  linkType: '',
  link: '',
  imageW: 0,
  imageH: 0,
  dimW: 0,
  dimH: 0,
  offsetW: 0,
  offsetH: 0,
  selected: 0,
  selection: 's',
  lastSelectedChild: -1,
  lineWidth: 1,
  lineType: LineTypes.bezier,
  lineColor: '#bbbbbb',
  sBorderWidth: 1,
  fBorderWidth: 1,
  sBorderColor: undefined,
  fBorderColor: undefined,
  sFillColor: undefined,
  fFillColor: undefined,
  textFontSize: 14,
  textColor: 'default',
  taskStatus: 0,
  note: '',
  llmDataType: '',
  llmDataId: '',
} as NSaveOptional

export const nSaveNever = {
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
  nodeY: 0,
  isTop: 0,
  isBottom: 0,
} as NSaveNever
