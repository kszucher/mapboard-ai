export enum Side {
  L = 'left',
  R = 'right',
}

export enum ControlType {
  FILE = 'FILE',
  INGESTION = 'INGESTION',
  CONTEXT = 'CONTEXT',
  QUESTION = 'QUESTION',
  VECTOR_DATABASE = 'VECTOR_DATABASE',
  LLM = 'LLM',
}

export interface G {
  isLocked: boolean;
}

export interface L {
  fromNodeId: string;
  fromNodeSide: Side;
  fromNodeSideIndex: number;
  toNodeId: string;
  toNodeSide: Side;
  toNodeSideIndex: number;
  lineColor: string;
  lineWidth: number;
  isProcessing: boolean;
}

export interface R {
  iid: number;
  offsetW: number;
  offsetH: number;
  selfW: number;
  selfH: number;
  controlType: ControlType;
  isProcessing: boolean;
  fileHash?: string;
  fileName?: string;
  ingestionHash?: string;
  context?: string;
  question?: string;
  llmHash?: string;
}

export type M = { g: G, l: Record<string, L>, r: Record<string, R> };
export type MDelta = { g?: Partial<G>, l?: Record<string, Partial<L>>, r?: Record<string, Partial<R>> };
