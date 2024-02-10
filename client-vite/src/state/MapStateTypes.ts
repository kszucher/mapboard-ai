import {LineType, ControlType, Side, Flow} from "./Enums"

export type PG = ['g']
export type PL = ['l', number]
export type PTR = ['r', number]
export type PTS = [...any[], 's', number] | ['s', number]
export type PTC = [...any[], 'c', number, number] | ['c', number, number]
export type PT = PTR | PTS | PTC
export type P = PG | PL | PT

export interface GSaveAlways {
  path: PG
  nodeId: string
}

export interface GSaveOptional {
  density: string
  flow: Flow
}

export interface GSaveNever {
  selfW: number
  selfH: number
  sLineDeltaXDefault: number
}

export interface LSaveAlways {
  path: PL
  nodeId: string
  fromNodeId: string
  fromNodeSide: Side
  toNodeId: string
  toNodeSide: Side
}

export interface LSaveOptional {
  lineColor: string
  lineWidth: number
}

export interface LSaveNever {

}

export interface TSaveAlways {
  path: PT
  nodeId: string
}

export interface TSaveOptional {
  controlType: ControlType // r
  offsetW: number // r
  offsetH: number // r
  llmDataType: string // r
  llmDataId: string // r
  note: string // r
  contentType: string // s
  content: string // s
  linkType: string // s
  link: string // s
  imageW: number // s
  imageH: number // s
  dimW: number // s || c
  dimH: number // s || c
  selected: number // r || s || c
  selection: string // s
  lastSelectedChild: number // r || s || c
  lineWidth: number // s || c
  lineType: LineType // s || c
  lineColor: string // s || c
  sBorderWidth: number // s
  fBorderWidth: number // s
  sBorderColor: string // s
  fBorderColor: string // s
  sFillColor: string // s
  fFillColor: string // s
  textFontSize: number // s
  textColor: string // s
  taskStatus: number // s
  blur: number // s
}

export interface TSaveNever {
  // mapChain
  si1: string
  si2: string
  so1: string[]
  so2: string[]
  co1: string[]
  co2: string[]
  tsu: string[]
  // mapMeasure
  selfW: number
  selfH: number
  familyW: number
  familyH: number
  maxW: number
  maxH: number
  calcOffsetX: number
  calcOffsetY: number
  // mapPlaceIndented
  nodeStartX: number
  nodeStartY: number
  isTop: number
  isBottom: number
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
