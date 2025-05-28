import { getControlTypeDimensions } from './map-consts';
import { ControlType, L, R, Side } from './map-types';

export const lDefault: L = {
  fromNodeId: '',
  fromNodeSide: Side.L,
  toNodeSide: Side.R,
  toNodeId: '',
  lineColor: '#bbbbbb',
  lineWidth: 1,
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
