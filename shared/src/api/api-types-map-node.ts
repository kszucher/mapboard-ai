import { BadgeProps } from '@radix-ui/themes';

export const M_PADDING = 40;
export const N_PADDING = 40;

export type N = {
  id: number;
  workspaceId: number | null;
  iid: number;
  offsetX: number;
  offsetY: number;
  controlType: ControlType;
  isProcessing: boolean;
  fileHash: string | null;
  fileName: string | null;
  ingestionOutputJson: any | null;
  vectorDatabaseId: string | null;
  vectorDatabaseOutputText: string | null;
  dataFrameOutputJson: any | null;
  contextOutputText: string | null;
  questionOutputText: string | null;
  llmInstructions: string | null;
  llmOutputSchema: LlmOutputSchema | null;
  llmOutputJson: any | null;
  visualizerOutputText: string | null;
  updatedAt: Date;
}

export const ControlType = {
  FILE: 'FILE',
  INGESTION: 'INGESTION',
  CONTEXT: 'CONTEXT',
  QUESTION: 'QUESTION',
  VECTOR_DATABASE: 'VECTOR_DATABASE',
  DATA_FRAME: 'DATA_FRAME',
  LLM: 'LLM',
  VISUALIZER: 'VISUALIZER',
} as const;

export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export const LlmOutputSchema = {
  TEXT: 'TEXT',
  VECTOR_DATABASE_QUERY: 'VECTOR_DATABASE_QUERY',
  DATA_FRAME_QUERY: 'DATA_FRAME_QUERY',
} as const;

export type LlmOutputSchema = (typeof LlmOutputSchema)[keyof typeof LlmOutputSchema];

export const controlBaseSizes: Record<ControlType, { w: number; h: number }> = {
  [ControlType.FILE]: { w: 160, h: 90 },
  [ControlType.INGESTION]: { w: 160, h: 90 },
  [ControlType.CONTEXT]: { w: 200, h: 160 },
  [ControlType.QUESTION]: { w: 200, h: 200 },
  [ControlType.VECTOR_DATABASE]: { w: 180, h: 60 },
  [ControlType.DATA_FRAME]: { w: 200, h: 100 },
  [ControlType.LLM]: { w: 200, h: 200 },
  [ControlType.VISUALIZER]: { w: 200, h: 160 },
};

export const controlColors: Record<ControlType, NonNullable<BadgeProps['color']>> = {
  [ControlType.FILE]: 'yellow',
  [ControlType.INGESTION]: 'cyan',
  [ControlType.CONTEXT]: 'violet',
  [ControlType.QUESTION]: 'lime',
  [ControlType.VECTOR_DATABASE]: 'brown',
  [ControlType.DATA_FRAME]: 'crimson',
  [ControlType.LLM]: 'jade',
  [ControlType.VISUALIZER]: 'lime',
};

export const controlTexts: Record<ControlType, string> = {
  [ControlType.FILE]: 'File Upload',
  [ControlType.INGESTION]: 'Ingestion',
  [ControlType.CONTEXT]: 'Context',
  [ControlType.QUESTION]: 'Question',
  [ControlType.VECTOR_DATABASE]: 'Vector Database',
  [ControlType.DATA_FRAME]: 'Data Frame',
  [ControlType.LLM]: 'LLM',
  [ControlType.VISUALIZER]: 'Visualizer',
};

export const allowedTargetControls: Record<ControlType, ControlType[]> = {
  [ControlType.FILE]: [ControlType.INGESTION, ControlType.DATA_FRAME],
  [ControlType.INGESTION]: [ControlType.VECTOR_DATABASE],
  [ControlType.CONTEXT]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.QUESTION]: [ControlType.VECTOR_DATABASE, ControlType.LLM],
  [ControlType.VECTOR_DATABASE]: [ControlType.LLM],
  [ControlType.DATA_FRAME]: [ControlType.LLM, ControlType.VISUALIZER],
  [ControlType.LLM]: [ControlType.LLM, ControlType.VECTOR_DATABASE, ControlType.DATA_FRAME, ControlType.VISUALIZER],
  [ControlType.VISUALIZER]: [],
};

export const allowedSourceControls: Record<ControlType, ControlType[]> = {
  [ControlType.FILE]: [],
  [ControlType.INGESTION]: [ControlType.FILE],
  [ControlType.CONTEXT]: [],
  [ControlType.QUESTION]: [],
  [ControlType.VECTOR_DATABASE]: [ControlType.INGESTION, ControlType.CONTEXT, ControlType.LLM],
  [ControlType.DATA_FRAME]: [ControlType.FILE, ControlType.LLM],
  [ControlType.LLM]: [ControlType.LLM, ControlType.VECTOR_DATABASE, ControlType.DATA_FRAME, ControlType.CONTEXT, ControlType.QUESTION],
  [ControlType.VISUALIZER]: [ControlType.LLM, ControlType.DATA_FRAME],
};
