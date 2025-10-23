import { Color } from './api-types-node-type';

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
  FromEdges: {
    ToNode: {
      NodeType: {
        id: number;
        color: Color
      }
    }
  }[];
  ToEdges: {
    FromNode: {
      NodeType: {
        id: number;
        color: Color
      }
    }
  }[];
  NodeType: {
    id: number;
    type: string;
    w: number;
    h: number;
    color: Color;
    OutEdgeTypes: {
      ToNodeType: {
        id: number;
        color: Color
      }
    }[];
    InEdgeTypes: {
      FromNodeType: {
        id: number;
        color: Color
      }
    }[];
  };
  updatedAt: Date;
};

export type NodeUpdateUp = Partial<Omit<N, 'id' | 'mapId' | 'FromEdges' | 'ToEdges' | 'NodeType' | 'workspaceId' | 'updatedAt' | 'createdAt'>>

export type NodeUpdateDown = Required<Pick<N, 'id' | 'workspaceId' | 'updatedAt'>>;

export const LlmOutputSchema = {
  TEXT: 'TEXT',
  VECTOR_DATABASE_QUERY: 'VECTOR_DATABASE_QUERY',
  DATA_FRAME_QUERY: 'DATA_FRAME_QUERY',
} as const;

export type LlmOutputSchema = (typeof LlmOutputSchema)[keyof typeof LlmOutputSchema];
