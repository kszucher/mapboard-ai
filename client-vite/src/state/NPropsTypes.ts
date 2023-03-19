import {LineTypes} from "../core/Enums"

export interface NSaveAlways {
  path: any[],
  d: N[],
  s: N[],
  c: N[][],
  nodeId: string,
}

export interface NSaveOptional {
  contentType: string,
  content: string,
  linkType: string,
  link: string,
  imageW: number,
  imageH: number,
  dimW: number,
  dimH: number,
  selected: number,
  selection: string,
  lastSelectedChild: number
  lineWidth: number,
  lineType: LineTypes,
  lineColor: string,
  sBorderWidth: number,
  fBorderWidth: number,
  sBorderColor: string | undefined,
  fBorderColor: string | undefined,
  sFillColor: string | undefined,
  fFillColor: string | undefined,
  textFontSize: number,
  textColor: string,
  taskStatus: number,
}

export interface NSaveNever {
  // mapChain
  isRoot: number,
  isRootChild: number,
  parentPath: any[],
  parentNodeId: string,
  parentParentNodeId: string,
  type: string,
  parentType: string,
  parentParentType: string,
  hasDir: number,
  hasStruct: number,
  hasCell: number,
  index: any[],
  // mapDiff
  dimChange: number,
  // mapMeasure
  selfW: number,
  selfH: number,
  familyW: number,
  familyH: number,
  maxColWidth: number[],
  maxRowHeight: number[],
  sumMaxColWidth: number[],
  sumMaxRowHeight: number[],
  maxW: number,
  maxH: number,
  spacing: number,
  spacingActivated: number,
  // mapPlace
  parentNodeStartX: number,
  parentNodeEndX: number,
  parentNodeY: number,
  lineDeltaX: number,
  lineDeltaY: number,
  nodeStartX: number,
  nodeEndX: number,
  nodeY: number,
  isTop: number,
  isBottom: number,
}

export type N = NSaveAlways & NSaveOptional & NSaveNever
export type NPartial = Required<NSaveAlways> & Partial<NSaveOptional> & Partial<NSaveNever>
