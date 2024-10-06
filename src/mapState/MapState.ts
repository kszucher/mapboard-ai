import {ControlType, Side} from "../consts/Enums.ts"
import {
  GSaveAlways,
  GSaveNever,
  GSaveOptional,
  LSaveAlways,
  LSaveNever,
  LSaveOptional,
  PG,
  PL,
  PR,
  RSaveAlways,
  RSaveNever,
  RSaveOptional,
} from "./MapStateTypes.ts"

export const gSaveAlways: GSaveAlways = {
  path: ['g'] as PG,
  nodeId: ''
}

export const gSaveOptional: GSaveOptional = {

}

export const gSaveNever: GSaveNever = {
  selfW: 0,
  selfH: 0,
}

export const lSaveAlways: LSaveAlways = {
  path: [] as unknown as PL,
  nodeId: '',
  fromNodeId: '',
  fromNodeSide: Side.L,
  toNodeSide: Side.R,
  toNodeId: '',
}

export const lSaveOptional: LSaveOptional = {
  lineColor: '#bbbbbb',
  lineWidth: 1,
  selected: 0,
}

export const lSaveNever: LSaveNever = {

}

export const rSaveAlways: RSaveAlways = {
  path: [] as unknown as PR,
  nodeId: '',
}

export const rSaveOptional: RSaveOptional = {
  controlType: ControlType.NONE,
  offsetW: 0,
  offsetH: 0,
  note: '',
  ingestionHash: '',
  extractionHash: '',
  selected: 0,
  lastSelectedChild: -1,
}

export const rSaveNever: RSaveNever = {
  selfW: 0,
  selfH: 0,
  maxW: 0,
  maxH: 0,
  familyW: 0,
  familyH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
}
