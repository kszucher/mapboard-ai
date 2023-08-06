import {LineTypes} from "./Enums"

export interface Connection {
  fromNodeId: string
  fromNodeSide: string
  toNodeId: string
  toNodeSide: string
}

export interface GSaveAlways {
  path: P
  nodeId: string
}

export interface GSaveOptional {
  alignment: string
  density: string
  connections: Connection[]
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

export interface NSaveOptional {
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
}

export interface NSaveNever {
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

export interface NSaveAlways {
  path: P
  nodeId: string
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
export type N = NSaveAlways & NSaveOptional & NSaveNever
export type NPartial = Required<NSaveAlways> & Partial<NSaveOptional> & Partial<NSaveNever>
export type GN = G & N
export type GNPartial = GPartial & NPartial
export type M = GN[]
export type MPartial = GNPartial[]
export type PIC = 'g' | 'r' | 'd' | 's' | 'c'
export type PI = PIC | number
export type P = PI[]
