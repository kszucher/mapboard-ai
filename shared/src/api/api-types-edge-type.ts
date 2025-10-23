export type EdgeType = {
  id: number;
  fromNodeTypeId: number;
  toNodeTypeId: number;
}

export type GetEdgeTypeQueryResponseDto = Partial<EdgeType>[]

export type CreateEdgeTypeRequestDto = {
  fromNodeTypeId: number;
  toNodeTypeId: number;
}
