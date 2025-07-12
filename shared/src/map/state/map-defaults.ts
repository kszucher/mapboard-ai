import { L, R } from './map-types';

export const lDefault: L = {
  fromNodeId: '',
  fromNodeSideIndex: 0,
  toNodeId: '',
  toNodeSideIndex: 0,
  lineColor: '#bbbbbb',
  lineWidth: 1,
  isProcessing: false,
};

export const rDefault: Partial<R> = {
  iid: -1,
  offsetW: 0,
  offsetH: 0,
  selfW: 0,
  selfH: 0,
  isProcessing: false,
  fileHash: '',
  fileName: '',
  ingestionId: -1,
  vectorDatabaseId: -1,
  context: '',
  question: '',
  llmHash: '',
};
