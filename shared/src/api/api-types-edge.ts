export type Edge = {
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
    NodeType: {
      id: number;
    }
  },
  ToNode: {
    id: number;
    offsetX: number;
    offsetY: number;
    NodeType: {
      id: number;
    }
  }
  updatedAt: Date;
}
