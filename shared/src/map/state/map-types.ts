export enum Side {
  L = 'left',
  R = 'right',
}

export enum ControlType {
  FILE = 'FILE',
  INGESTION = 'INGESTION',
  VECTOR_DATABASE = 'VECTOR_DATABASE',
  EXTRACTION = 'EXTRACTION',
  TEXT_INPUT = 'TEXT_INPUT',
  TEXT_OUTPUT = 'TEXT_OUTPUT',
}

export interface GSaveAlways {
}

export interface GSaveOptional {
}

export interface GSaveNever {
  selfW: number;
  selfH: number;
}

export interface LSaveAlways {
  fromNodeId: string;
  fromNodeSide: Side;
  toNodeId: string;
  toNodeSide: Side;
}

export interface LSaveOptional {
  lineColor: string;
  lineWidth: number;
}

export interface LSaveNever {
}

export interface RSaveAlways {
  iid: number;
}

export interface RSaveOptional {
  controlType: ControlType;
  offsetW: number;
  offsetH: number;
  fileHash: string;
  fileName: string;
  ingestionHash: string;
  extractionHash: string;
  extractionPrompt: string;
  textInput: string;
  textOutput: string;
  isProcessing: boolean;
}

export interface RSaveNever {
  selfW: number;
  selfH: number;
  nodeStartX: number;
  nodeStartY: number;
}

export type G = GSaveAlways & GSaveOptional & GSaveNever;
export type L = LSaveAlways & LSaveOptional & LSaveNever;
export type R = RSaveAlways & RSaveOptional & RSaveNever;
export type M = { g: G, l: Record<string, L>, r: Record<string, R> };

export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>;
export type LPartial = Required<LSaveAlways> & Partial<LSaveOptional> & Partial<LSaveNever>;
export type RPartial = Required<RSaveAlways> & Partial<RSaveOptional> & Partial<RSaveNever>;
export type MPartial = { g: GPartial, l: Record<string, LPartial>, r: Record<string, RPartial> };
