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

const { FILE, INGESTION, CONTEXT, QUESTION, VECTOR_DATABASE, DATA_FRAME, LLM, VISUALIZER } = ControlType;

export const controlBaseSizes: Record<ControlType, { w: number; h: number }> = {
  FILE: { w: 160, h: 90 },
  INGESTION: { w: 160, h: 90 },
  CONTEXT: { w: 200, h: 160 },
  QUESTION: { w: 200, h: 200 },
  VECTOR_DATABASE: { w: 180, h: 60 },
  DATA_FRAME: { w: 200, h: 100 },
  LLM: { w: 200, h: 200 },
  VISUALIZER: { w: 200, h: 160 },
};

export const controlColors: Record<ControlType, NonNullable<BadgeProps['color']>> = {
  FILE: 'yellow',
  INGESTION: 'cyan',
  CONTEXT: 'violet',
  QUESTION: 'lime',
  VECTOR_DATABASE: 'brown',
  DATA_FRAME: 'crimson',
  LLM: 'jade',
  VISUALIZER: 'lime',
};

export const controlTexts: Record<ControlType, string> = {
  FILE: 'File Upload',
  INGESTION: 'Ingestion',
  CONTEXT: 'Context',
  QUESTION: 'Question',
  VECTOR_DATABASE: 'Vector Database',
  DATA_FRAME: 'Data Frame',
  LLM: 'LLM',
  VISUALIZER: 'Visualizer',
};

export const allowedTargetControls: Record<ControlType, ControlType[]> = {
  FILE: [INGESTION, DATA_FRAME],
  INGESTION: [VECTOR_DATABASE],
  CONTEXT: [VECTOR_DATABASE, LLM],
  QUESTION: [VECTOR_DATABASE, LLM],
  VECTOR_DATABASE: [LLM],
  DATA_FRAME: [LLM, VISUALIZER],
  LLM: [LLM, VECTOR_DATABASE, DATA_FRAME, VISUALIZER],
  VISUALIZER: [],
};

export const allowedSourceControls: Record<ControlType, ControlType[]> = {
  FILE: [],
  INGESTION: [FILE],
  CONTEXT: [],
  QUESTION: [],
  VECTOR_DATABASE: [INGESTION, CONTEXT, LLM],
  DATA_FRAME: [FILE, LLM],
  LLM: [LLM, VECTOR_DATABASE, DATA_FRAME, CONTEXT, QUESTION],
  VISUALIZER: [LLM, DATA_FRAME],
};
