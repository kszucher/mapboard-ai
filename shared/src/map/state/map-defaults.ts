import { getControlTypeDimensions } from '../getters/map-queries';
import { ControlType, L, N } from './map-consts-and-types';

export const lDefault: L = {
  fromNodeId: '',
  fromNodeSideIndex: 0,
  toNodeId: '',
  toNodeSideIndex: 0,
  lineColor: '#bbbbbb',
  lineWidth: 1,
  isProcessing: false,
};

export const nDefault: N = {
  iid: -1,
  offsetW: 0,
  offsetH: 0,
  selfW: getControlTypeDimensions(ControlType.FILE).w,
  selfH: getControlTypeDimensions(ControlType.FILE).h,
  controlType: ControlType.FILE,
  isProcessing: false,
  fileHash: '',
  fileName: '',
  ingestionId: null,
  vectorDatabaseId: null,
  context: '',
  question: '',
  llmHash: '',
};
