import { getControlTypeDimensions } from './map-consts';
import { ControlType, G, L, R } from './map-types';

export const gDefault: G = {
  isLocked: false,
};

export const lDefault: L = {
  fromNodeId: '',
  fromNodeSideIndex: 0,
  toNodeId: '',
  toNodeSideIndex: 0,
  lineColor: '#bbbbbb',
  lineWidth: 1,
  isProcessing: false,
};

export const rDefault: R = {
  iid: -1,
  offsetW: 0,
  offsetH: 0,
  selfW: getControlTypeDimensions(ControlType.CONTEXT).w,
  selfH: getControlTypeDimensions(ControlType.CONTEXT).h,
  controlType: ControlType.CONTEXT,
  isProcessing: false,
  fileHash: '',
  fileName: '',
  ingestionId: -1,
  vectorDatabaseId: -1,
  context: '',
  question: '',
  llmHash: '',
};
