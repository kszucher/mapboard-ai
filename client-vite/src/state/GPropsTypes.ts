import {P} from "./MTypes"

export interface SC {
  structSelectedPathList: P[]
  cellSelectedPathList: P[]
  isRootIncluded: boolean
  maxSel: number
  maxSelIndex: number
  scope: string
  lastPath: P
  geomHighPath: P
  geomLowPath: P
  isCellRowSelected: number
  cellRow: number
  isCellColSelected: number
  cellCol: number
  haveSameParent: number
  sameParentPath: P
}

export interface GSaveAlways {
  path: P
  nodeId: string
}

export interface GSaveOptional {
  alignment: string
  density: string
  taskConfigN: number
  taskConfigGap: number
  margin: number
}

export interface GSaveNever {
  mapWidth: number
  mapHeight: number
  mapStartCenterX: number
  sLineDeltaXDefault: number
  padding: number
  defaultH: number
  taskConfigD: number
  taskConfigWidth: number
  sc: SC
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
