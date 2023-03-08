import {LineTypes} from "./Enums"
import {SC, NC, GSaveAlways, GSaveOptional, GSaveNever, NSaveAlways, NSaveOptional, NSaveNever} from "../types/DefaultProps"

const sc = {
  structSelectedPathList: [],
  cellSelectedPathList: [],
  isRootIncluded: false,
  maxSel: 0,
  maxSelIndex: 0,
  scope: '',
  lastPath: [],
  geomHighPath: [],
  geomLowPath: [],
  isCellRowSelected: 0,
  cellRow: 0,
  isCellColSelected: 0,
  cellCol: 0,
  haveSameParent: 0,
  sameParentPath: [],
} as SC

const nc = {
  selection: null,
  lineWidth: null,
  lineType: null,
  lineColor: null,
  borderWidth: null,
  borderColor: null,
  fillColor: null,
  textFontSize: null,
  textColor: null,
  taskStatus: null,
} as NC

export const gSaveAlways = {
  path: ['g'],
  nodeId: ''
} as GSaveAlways

export const gSaveOptional = {
  alignment: 'adaptive',
  density: 'large',
  taskConfigN: 4,
  taskConfigGap: 4,
  margin: 32,
} as GSaveOptional

export const gSaveNever = {
  mapWidth: 0,
  mapHeight: 0,
  sLineDeltaXDefault: 0,
  padding: 0,
  defaultH: 0,
  taskConfigD: 0,
  taskConfigWidth: 0,
  sc,
  nc,
  taskLeft: 0,
  taskRight: 0,
} as GSaveNever

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

export const getDefaultNode = (attributes?: any) => ({d: [], s: [], c: [[]], content: '', ...attributes})
