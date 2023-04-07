import {GSaveAlways, GSaveNever, GSaveOptional, SC} from "./GPropsTypes"

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
  mapStartCenterX: 0,
  sLineDeltaXDefault: 0,
  padding: 0,
  defaultH: 0,
  taskConfigD: 0,
  taskConfigWidth: 0,
  sc,
} as GSaveNever
