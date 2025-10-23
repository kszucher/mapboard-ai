export type E = {
  id: number;
  workspaceId: number | null;
  fromNodeId: number;
  toNodeId: number;
  lineColor: string;
  lineWidth: number;
  FromNode: {
    id: number;
    offsetX: number;
    offsetY: number;
    MapNodeConfig: {
      id: number;
    }
  },
  ToNode: {
    id: number;
    offsetX: number;
    offsetY: number;
    MapNodeConfig: {
      id: number;
    }
  }
  updatedAt: Date;
}

export type EdgeUpdateUp = Partial<Omit<E, 'id' | 'mapId' | 'FromNode' | 'ToNode' | 'workspaceId' | 'updatedAt' | 'createdAt'>>

export type EdgeUpdateDown = Required<Pick<E, 'id' | 'workspaceId' | 'updatedAt'>>;
