import { controlColors } from './map-consts';

export type ControlColor = (typeof controlColors)[keyof typeof controlColors];

export const ControlType = {
  FILE: 'FILE',
  INGESTION: 'INGESTION',
  CONTEXT: 'CONTEXT',
  QUESTION: 'QUESTION',
  VECTOR_DATABASE: 'VECTOR_DATABASE',
  LLM: 'LLM',
} as const;

export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export interface L {
  fromNodeId: string;
  fromNodeSideIndex: number;
  toNodeId: string;
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
  fileHash: string | null;
  fileName: string | null;
  ingestionId: number | null;
  vectorDatabaseId: number | null;
  context: string | null;
  question: string | null;
  llmHash: string | null;
}

export type M = { l: Record<string, L>, r: Record<string, R> };

export type MDelta = { l?: Record<string, Partial<L>>, r?: Record<string, Partial<R>> };
