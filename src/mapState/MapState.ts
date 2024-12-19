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
} from './MapStateTypes.ts';
import { ControlType, Side } from './MapStateTypesEnums.ts';

export const gSaveAlways: GSaveAlways = {
  path: <PG>['g'],
  nodeId: '',
};

export const gSaveOptional: GSaveOptional = {};

export const gSaveNever: GSaveNever = {
  selfW: 0,
  selfH: 0,
};

export const lSaveAlways: LSaveAlways = {
  path: <PL>(<unknown>[]),
  nodeId: '',
  fromNodeId: '',
  fromNodeSide: Side.L,
  toNodeSide: Side.R,
  toNodeId: '',
};

export const lSaveOptional: LSaveOptional = {
  lineColor: '#bbbbbb',
  lineWidth: 1,
  selected: 0,
};

export const lSaveNever: LSaveNever = {};

export const rSaveAlways: RSaveAlways = {
  path: <PR>(<unknown>[]),
  nodeId: '',
};

export const rSaveOptional: RSaveOptional = {
  controlType: ControlType.NONE,
  offsetW: 0,
  offsetH: 0,
  note: '',
  fileHash: '',
  ingestionHash: '',
  extractionHash: '',
  selected: 0,
  lastSelectedChild: -1,
};

export const rSaveNever: RSaveNever = {
  selfW: 0,
  selfH: 0,
  maxW: 0,
  maxH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
};
