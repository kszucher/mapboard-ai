export const M_PADDING = 40;
export const N_PADDING = 40;

export type N = {
  id: number;
  workspaceId: number | null;
  iid: number;
  offsetX: number;
  offsetY: number;
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
  MapNodeConfig: {
    id: number;
    type: string;
  };
  updatedAt: Date;
}

export const LlmOutputSchema = {
  TEXT: 'TEXT',
  VECTOR_DATABASE_QUERY: 'VECTOR_DATABASE_QUERY',
  DATA_FRAME_QUERY: 'DATA_FRAME_QUERY',
} as const;

export type LlmOutputSchema = (typeof LlmOutputSchema)[keyof typeof LlmOutputSchema];
