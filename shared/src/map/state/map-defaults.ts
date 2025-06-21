import { getControlTypeDimensions } from './map-consts';
import { ControlType, G, L, R, Side } from './map-types';

export const gDefault: G = {
  isLocked: false,
};

export const lDefault: L = {
  fromNodeId: '',
  fromNodeSide: Side.L,
  fromNodeSideIndex: 0,
  toNodeId: '',
  toNodeSide: Side.R,
  toNodeSideIndex: 0,
  lineColor: '#bbbbbb',
  lineWidth: 1,
  isProcessing: false,
};

export const rDefault: R = {
  iid: -1,
  controlType: ControlType.TEXT_INPUT,
  offsetW: 0,
  offsetH: 0,
  selfW: getControlTypeDimensions(ControlType.TEXT_INPUT).w,
  selfH: getControlTypeDimensions(ControlType.TEXT_INPUT).h,
  fileHash: '',
  fileName: '',
  ingestionHash: '',
  extractionHash: '',
  extractionPrompt: '',
  textInput: '',
  textOutput: '',
  isProcessing: false,
};
