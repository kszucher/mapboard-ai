import { Color } from './api-types-map-config';

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
      MapNodeConfig: {
        id: number;
        color: Color
      }
    }
  }[];
  ToEdges: {
    FromNode: {
      MapNodeConfig: {
        id: number;
        color: Color
      }
    }
  }[];
  MapNodeConfig: {
    id: number;
    type: string;
    w: number;
    h: number;
    color: Color;
    MapEdgeConfigFrom: {
      ToNodeConfig: {
        id: number;
        color: Color
      }
    }[];
    MapEdgeConfigTo: {
      FromNodeConfig: {
        id: number;
        color: Color
      }
    }[];
  };
  updatedAt: Date;
};

export type NodeUpdateUp = Partial<Omit<N, 'id' | 'mapId' | 'FromEdges' | 'ToEdges' | 'MapNodeConfig' | 'workspaceId' | 'updatedAt' | 'createdAt'>>

export type NodeUpdateDown = Required<Pick<N, 'id' | 'workspaceId' | 'updatedAt'>>;

export const LlmOutputSchema = {
  TEXT: 'TEXT',
  VECTOR_DATABASE_QUERY: 'VECTOR_DATABASE_QUERY',
  DATA_FRAME_QUERY: 'DATA_FRAME_QUERY',
} as const;

export type LlmOutputSchema = (typeof LlmOutputSchema)[keyof typeof LlmOutputSchema];
