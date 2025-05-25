import {
  ControlType,
  GSaveAlways,
  GSaveNever,
  GSaveOptional,
  LSaveAlways,
  LSaveNever,
  LSaveOptional,
  RSaveAlways,
  RSaveNever,
  RSaveOptional,
  Side,
} from './map-types';

export const gSaveAlways: GSaveAlways = {};

export const gSaveOptional: GSaveOptional = {};

export const gSaveNever: GSaveNever = {
  selfW: 0,
  selfH: 0,
};

export const lSaveAlways: LSaveAlways = {
  fromNodeId: '',
  fromNodeSide: Side.L,
  toNodeSide: Side.R,
  toNodeId: '',
};

export const lSaveOptional: LSaveOptional = {
  lineColor: '#bbbbbb',
  lineWidth: 1,
};

export const lSaveNever: LSaveNever = {};

export const rSaveAlways: RSaveAlways = {
  iid: -1,
};

export const rSaveOptional: RSaveOptional = {
  controlType: ControlType.FILE,
  offsetW: 0,
  offsetH: 0,
  fileHash: '',
  fileName: '',
  ingestionHash: '',
  extractionHash: '',
  extractionPrompt: '',
  textInput: '',
  textOutput: '',
  isProcessing: false,
};

export const rSaveNever: RSaveNever = {
  selfW: 0,
  selfH: 0,
  nodeStartX: 0,
  nodeStartY: 0,
};
