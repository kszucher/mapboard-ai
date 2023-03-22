export interface SC {
  structSelectedPathList: any[]
  cellSelectedPathList: any[]
  isRootIncluded: boolean
  maxSel: number
  maxSelIndex: number
  scope: string
  lastPath: any[]
  geomHighPath: any[]
  geomLowPath: any[]
  isCellRowSelected: number
  cellRow: number
  isCellColSelected: number
  cellCol: number
  haveSameParent: number
  sameParentPath: any[]
}

export interface NC {
  selection: string & null
  lineWidth: number & null
  lineType: string & null
  lineColor: string & null
  borderWidth: number & null
  borderColor: string & null
  fillColor: string & null
  textFontSize: number & null
  textColor: string & null
  taskStatus: number & null
}

export interface GSaveAlways {
  path: any[]
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
  nc: NC
  taskLeft: number
  taskRight: number
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
