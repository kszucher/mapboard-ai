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
  EXTRACTION = 'EXTRACTION',
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
  controlType: ControlType;
  offsetW: number;
  offsetH: number;
  selfW: number;
  selfH: number;
  fileHash?: string;
  fileName?: string;
  ingestionHash?: string;
  extractionHash?: string;
  context?: string;
  question?: string;
  isProcessing: boolean;
}

export type M = { g: G, l: Record<string, L>, r: Record<string, R> };
export type MDelta = { g?: Partial<G>, l?: Record<string, Partial<L>>, r?: Record<string, Partial<R>> };
