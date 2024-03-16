import {LineType, ControlType, Side, Flow} from "./Enums"

export type PG = ['g']
export type PL = ['l', number]
export type PR = ['r', number]
export type PS = [...any[], 's', number]
export type PC = [...any[], 'c', number, number]
export type PT = PR | PS | PC
export type P = PG | PL | PR | PS | PC

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

export interface RSaveAlways {
  path: PR
  nodeId: string
}

export interface RSaveOptional {
  controlType: ControlType
  offsetW: number
  offsetH: number
  note: string
  ingestionHash: string
  extractionHash: string
  selected: number
  lastSelectedChild: number
}

export interface RSaveNever {
  so1: string[]
  so: string[]
  co: string[]
  selfW: number
  selfH: number
  familyW: number
  familyH: number
  maxW: number
  maxH: number
  nodeStartX: number
  nodeStartY: number
}

export interface SSaveAlways {
  path: PS
  nodeId: string
}

export interface SSaveOptional {
  contentType: string
  content: string
  linkType: string
  link: string
  imageW: number
  imageH: number
  dimW: number
  dimH: number
  selected: number
  selection: string
  lastSelectedChild: number
  lineWidth: number
  lineType: LineType
  lineColor: string
  sBorderWidth: number
  fBorderWidth: number
  sBorderColor: string
  fBorderColor: string
  sFillColor: string
  fFillColor: string
  textFontSize: number
  textColor: string
  taskStatus: number
  blur: number
}

export interface SSaveNever {
  ri1: string
  si1: string
  ci1: string
  so1: string[]
  so: string[]
  co1: string[]
  co: string[]
  su: string[]
  sd: string[]
  rowCount: number
  colCount: number
  isTop: number
  isBottom: number
  selfW: number
  selfH: number
  familyW: number
  familyH: number
  maxW: number
  maxH: number
  nodeStartX: number
  nodeStartY: number
}

export interface CSaveAlways {
  path: PC
  nodeId: string
}

export interface CSaveOptional {
  dimW: number
  dimH: number
  selected: number
  lastSelectedChild: number
  lineWidth: number
  lineType: LineType
  lineColor: string
}

export interface CSaveNever {
  ri2: string
  si1: string
  si2: string
  so1: string[]
  so: string[]
  cu: string[]
  cd: string[]
  cv: string[]
  cl: string[]
  cr: string[]
  ch: string[]
  selfW: number
  selfH: number
  familyW: number
  familyH: number
  maxW: number
  maxH: number
  nodeStartX: number
  nodeStartY: number
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type L = LSaveAlways & LSaveOptional & LSaveNever
export type R = RSaveAlways & RSaveOptional & RSaveNever
export type S = SSaveAlways & SSaveOptional & SSaveNever
export type C = CSaveAlways & CSaveOptional & CSaveNever
export type T = R | S | C
export type N = G | L | R | S | C
export type M = N[]

export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
export type LPartial = Required<LSaveAlways> & Partial<LSaveOptional> & Partial<LSaveNever>
export type RPartial = Required<RSaveAlways> & Partial<RSaveOptional> & Partial<RSaveNever>
export type SPartial = Required<SSaveAlways> & Partial<SSaveOptional> & Partial<SSaveNever>
export type CPartial = Required<CSaveAlways> & Partial<CSaveOptional> & Partial<CSaveNever>
export type NPartial = GPartial | LPartial | RPartial | SPartial | CPartial
export type MPartial = NPartial[]
