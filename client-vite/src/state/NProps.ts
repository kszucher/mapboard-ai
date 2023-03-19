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
  isRootChild: 0,
  parentPath: [],
  parentNodeId: '',
  parentParentNodeId: '',
  type: '',
  parentType: '',
  parentParentType: '',
  hasDir: 0,
  hasStruct: 0,
  hasCell: 0,
  index: [],
  // mapDiff
  dimChange: 0,
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
  spacingActivated: 0,
  // mapPlace
  parentNodeStartX: 0,
  parentNodeEndX: 0,
  parentNodeY: 0,
  lineDeltaX: 0,
  lineDeltaY: 0,
  nodeStartX: 0,
  nodeEndX: 0,
  nodeY: 0,
  isTop: 0,
  isBottom: 0,
} as NSaveNever
