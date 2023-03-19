import {LineTypes} from "../core/Enums"

interface SC {
  structSelectedPathList: any[],
  cellSelectedPathList: any[],
  isRootIncluded: boolean,
  maxSel: number,
  maxSelIndex: number,
  scope: string,
  lastPath: any[],
  geomHighPath: any[],
  geomLowPath: any[],
  isCellRowSelected: number,
  cellRow: number,
  isCellColSelected: number,
  cellCol: number,
  haveSameParent: number,
  sameParentPath: any[]
}

interface NC {
  selection: string & null,
  lineWidth: number & null,
  lineType: string & null,
  lineColor: string & null,
  borderWidth: number & null,
  borderColor: string & null,
  fillColor: string & null,
  textFontSize: number & null,
  textColor: string & null,
  taskStatus: number & null,
}

interface GSaveAlways {
  path: any[],
  nodeId: string
}

interface GSaveOptional {
  alignment: string,
  density: string,
  taskConfigN: number,
  taskConfigGap: number,
  margin: number,
}

interface GSaveNever {
  mapWidth: number,
  mapHeight: number,
  sLineDeltaXDefault: number,
  padding: number,
  defaultH: number,
  taskConfigD: number,
  taskConfigWidth: number,
  sc: SC,
  nc: NC,
  taskLeft: number,
  taskRight: number,
}

type G = GSaveAlways & GSaveOptional & GSaveNever

type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>

interface NSaveAlways {
  path: any[],
  d: N[],
  s: N[],
  c: N[][],
  nodeId: string,
}

interface NSaveOptional {
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

interface NSaveNever {
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

type N = NSaveAlways & NSaveOptional & NSaveNever

type NPartial = Required<NSaveAlways> & Partial<NSaveOptional> & Partial<NSaveNever>

interface M {
  g: G,
  r: N[]
}

type NL = N | G

interface MPartial {
  g: GPartial,
  r: NPartial[]
}
