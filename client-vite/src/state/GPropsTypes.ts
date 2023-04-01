import {Path} from "./MTypes"

export interface SC {
  structSelectedPathList: Path[]
  cellSelectedPathList: Path[]
  isRootIncluded: boolean
  maxSel: number
  maxSelIndex: number
  scope: string
  lastPath: Path
  geomHighPath: Path
  geomLowPath: Path
  isCellRowSelected: number
  cellRow: number
  isCellColSelected: number
  cellCol: number
  haveSameParent: number
  sameParentPath: Path
}

export interface GSaveAlways {
  path: Path
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
  sLineDeltaXDefault: number
  padding: number
  defaultH: number
  taskConfigD: number
  taskConfigWidth: number
  sc: SC
  taskLeft: number
  taskRight: number
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
