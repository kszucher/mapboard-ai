export const M_PADDING = 40;
export const N_PADDING = 40;

export type N = {
  id: number;
  workspaceId: number | null;
  iid: number;
  offsetX: number;
  offsetY: number;
  isProcessing: boolean;
  nodeTypeId: number;
  updatedAt: Date;
};

export type NodeUpdateUp = Partial<Omit<N, 'id' | 'mapId' | 'NodeType' | 'workspaceId' | 'updatedAt' | 'createdAt'>>

export type NodeUpdateDown = Required<Pick<N, 'id' | 'workspaceId' | 'updatedAt'>>;
