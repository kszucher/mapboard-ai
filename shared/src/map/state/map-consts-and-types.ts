export const M_PADDING = 40;
export const N_PADDING = 40;
import type { BadgeProps } from '@radix-ui/themes';

export type M = { l: Record<string, L>, n: Record<string, N> };

export interface L {
  fromNodeId: string;
  toNodeId: string;
  lineColor: string;
  lineWidth: number;
  isProcessing: boolean;
}

export interface N {
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
  vectorDatabaseId: string | null;
  context: string | null;
  question: string | null;
  llmHash: string | null;
}

export const ControlType = {
  FILE: 'FILE',
  INGESTION: 'INGESTION',
  CONTEXT: 'CONTEXT',
  QUESTION: 'QUESTION',
  VECTOR_DATABASE: 'VECTOR_DATABASE',
  DATAFRAME: 'DATAFRAME',
  LLM: 'LLM',
  VISUALIZER: 'VISUALIZER',
} as const;

export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export const controlBaseSizes: Record<ControlType, { w: number; h: number }> = {
  [ControlType.FILE]: { w: 160, h: 90 },
  [ControlType.INGESTION]: { w: 160, h: 90 },
  [ControlType.CONTEXT]: { w: 200, h: 200 },
  [ControlType.QUESTION]: { w: 200, h: 200 },
  [ControlType.VECTOR_DATABASE]: { w: 180, h: 60 },
  [ControlType.DATAFRAME]: { w: 180, h: 60 },
  [ControlType.LLM]: { w: 200, h: 270 },
  [ControlType.VISUALIZER]: { w: 200, h: 210 },
};

export const controlColors: Record<ControlType, NonNullable<BadgeProps['color']>> = {
  [ControlType.FILE]: 'yellow',
  [ControlType.INGESTION]: 'cyan',
  [ControlType.CONTEXT]: 'violet',
  [ControlType.QUESTION]: 'lime',
  [ControlType.VECTOR_DATABASE]: 'brown',
  [ControlType.DATAFRAME]: 'crimson',
  [ControlType.LLM]: 'jade',
  [ControlType.VISUALIZER]: 'lime',
};

export const controlTexts: Record<ControlType, string> = {
  [ControlType.FILE]: 'File Upload',
  [ControlType.INGESTION]: 'Ingestion',
  [ControlType.CONTEXT]: 'Context',
  [ControlType.QUESTION]: 'Question',
  [ControlType.VECTOR_DATABASE]: 'Vector Database',
  [ControlType.DATAFRAME]: 'Data Frame',
  [ControlType.LLM]: 'LLM',
  [ControlType.VISUALIZER]: 'Visualizer',
};

export const allowedTargetControls: Record<ControlType, ControlType[]> = {
  [ControlType.FILE]: [ControlType.INGESTION, ControlType.DATAFRAME],
  [ControlType.INGESTION]: [ControlType.VECTOR_DATABASE],
  [ControlType.CONTEXT]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.QUESTION]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.VECTOR_DATABASE]: [ControlType.LLM],
  [ControlType.DATAFRAME]: [ControlType.LLM, ControlType.VISUALIZER],
  [ControlType.LLM]: [ControlType.LLM, ControlType.DATAFRAME, ControlType.VISUALIZER],
  [ControlType.VISUALIZER]: [],
};

export const allowedSourceControls: Record<ControlType, ControlType[]> = {
  [ControlType.FILE]: [],
  [ControlType.INGESTION]: [ControlType.FILE],
  [ControlType.CONTEXT]: [],
  [ControlType.QUESTION]: [],
  [ControlType.VECTOR_DATABASE]: [ControlType.INGESTION, ControlType.CONTEXT, ControlType.QUESTION],
  [ControlType.DATAFRAME]: [ControlType.FILE, ControlType.LLM],
  [ControlType.LLM]: [ControlType.LLM, ControlType.VECTOR_DATABASE, ControlType.CONTEXT, ControlType.DATAFRAME, ControlType.QUESTION],
  [ControlType.VISUALIZER]: [ControlType.LLM, ControlType.DATAFRAME],
};
