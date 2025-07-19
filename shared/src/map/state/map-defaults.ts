import { ControlType, L, N } from './map-types';

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
  selfW: 0,
  selfH: 0,
  isProcessing: false,
  controlType: ControlType.FILE,
  ingestionId: null,
  vectorDatabaseId: null,
  fileHash: '',
  fileName: '',
  context: '',
  question: '',
  llmHash: '',
};
