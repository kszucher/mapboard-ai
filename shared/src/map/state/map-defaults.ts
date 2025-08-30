import { ControlType, L, N } from './map-consts-and-types';

export const lDefault: L = {
  fromNodeId: '',
  toNodeId: '',
  lineColor: '#bbbbbb',
  lineWidth: 1,
  isProcessing: false,
};

export const nDefault: N = {
  iid: 0,
  offsetW: 0,
  offsetH: 0,
  controlType: ControlType.FILE,
  isProcessing: false,
  fileHash: null,
  fileName: null,
  ingestionOutputJson: undefined,
  vectorDatabaseId: null,
  vectorDatabaseOutputText: null,
  dataFrameInputJson: undefined,
  dataFrameOutputText: null,
  contextOutputText: null,
  questionOutputText: null,
  llmInstructions: null,
  llmInputJson: undefined,
  llmOutputJson: undefined,
  visualizerInputText: null,
};
