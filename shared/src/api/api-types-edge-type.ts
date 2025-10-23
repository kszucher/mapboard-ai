import { NodeType } from './api-types-node-type';

export type EdgeType = {
  id: number;
  fromNodeTypeId: number;
  FromNodeType: Partial<NodeType>;
  toNodeTypeId: number;
  ToNodeType: Partial<NodeType>;
}

export type GetEdgeTypeQueryResponseDto = Partial<EdgeType>[]

export type CreateEdgeTypeRequestDto = {
  fromNodeTypeId: number;
  toNodeTypeId: number;
}
