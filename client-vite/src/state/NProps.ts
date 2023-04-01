import {NSaveAlways} from "./NPropsTypes"
import {NSaveOptional} from "./NPropsTypes"
import {NSaveNever} from "./NPropsTypes"
import {LineTypes} from "../core/Enums"

export const nSaveAlways = {
  path: [],
  d: [],
  s: [],
  c: [[]],
  nodeId: '',
} as NSaveAlways

export const nSaveOptional = {
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
  sBorderWidth: 1,
  fBorderWidth: 1,
  sBorderColor: undefined,
  fBorderColor: undefined,
  sFillColor: undefined,
  fFillColor: undefined,
  textFontSize: 14,
  textColor: 'default',
  taskStatus: 0,
} as NSaveOptional

export const nSaveNever = {
  // mapChain
  isRoot: 0,
  isRootChild: 0, // REMOVE, use type === 'dir' instead
  parentPath: [],
  type: '',
  parentType: '', // REMOVE
  parentParentType: '', // REMOVE
  hasDir: 0, // REMOVE, use dCount instead!!!
  hasStruct: 0, // REMOVE, use sCount instead!!!
  hasCell: 0,
  index: 0,
  dCount: 0,
  sCount: 0,
  cRowCount: 0,
  cColCount: 0,
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
  sumElapsedY: [0],
  spacing: 10,
  spacingActivated: 0,
  // mapPlace
  lineDeltaX: 0,
  lineDeltaY: 0,
  nodeStartX: 0,
  nodeEndX: 0,
  nodeY: 0,
  isTop: 0,
  isBottom: 0,
} as NSaveNever
