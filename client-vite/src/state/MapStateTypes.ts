import {LineTypes, ControlTypes} from "./Enums"

export type PIC = 'g' | 'l' | 'r' | 'd' | 's' | 'c'
export type PI = PIC | number
export type P = PI[]

export type PG = ['g']
export type PL = ['l', number]
export type PTR = ['r', number]
export type PTD = ['r', number, 'd', number]
export type PTS = [...any[], 's', number]
export type PTC = [...any[], 'c', number, number]
export type PT = PTR | PTD | PTS | PTC
// export type P = PG | PL | PT

export interface GSaveAlways {
  path: PG
  nodeId: string
}

export interface GSaveOptional {
  alignment: string
  density: string
}

export interface GSaveNever {
  mapWidth: number
  mapHeight: number
  maxD: number
  maxU: number
  maxR: number
  maxL: number
  sLineDeltaXDefault: number
}

export interface LSaveAlways {
  path: PL
  nodeId: string
  fromNodeId: string
  fromNodeSide: string
  toNodeId: string
  toNodeSide: string
}

export interface LSaveOptional {
  lineColor: string
  lineWidth: number
}

export interface LSaveNever {

}

export interface TSaveOptional {
  controlType: ControlTypes
  contentType: string
  content: string
  linkType: string
  link: string
  imageW: number
  imageH: number
  dimW: number
  dimH: number
  offsetW: number
  offsetH: number
  selected: number
  selection: string
  lastSelectedChild: number
  lineWidth: number
  lineType: LineTypes
  lineColor: string
  sBorderWidth: number
  fBorderWidth: number
  sBorderColor: string | undefined
  fBorderColor: string | undefined
  sFillColor: string | undefined
  fFillColor: string | undefined
  textFontSize: number
  textColor: string
  taskStatus: number
  note: string
  llmDataType: string
  llmDataId: string
  blur: number
}

export interface TSaveNever {
  // mapMeasure
  selfW: number
  selfH: number
  familyW: number
  familyH: number
  maxColWidth: number[]
  maxRowHeight: number[]
  sumMaxColWidth: number[]
  sumMaxRowHeight: number[]
  maxW: number
  maxH: number
  spacing: number
  // mapPlace
  nodeStartX: number
  nodeEndX: number
  nodeY: number
  isTop: number
  isBottom: number
}

export interface TSaveAlways {
  path: PT
  nodeId: string
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
export type L = LSaveAlways & LSaveOptional & LSaveNever
export type LPartial = Required<LSaveAlways> & Partial<LSaveOptional> & Partial<LSaveNever>
export type T = TSaveAlways & TSaveOptional & TSaveNever
export type TPartial = Required<TSaveAlways> & Partial<TSaveOptional> & Partial<TSaveNever>
export type GLT = G | L | T
export type GLTPartial = GPartial | LPartial | TPartial
export type N = GLT
export type M = GLT[]
export type MPartial = GLTPartial[]
