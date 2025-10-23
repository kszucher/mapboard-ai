import { NodeType } from './api-types-node-type';

export type EdgeType = {
  id: number;
  fromNodeConfigId: number;
  FromNodeConfig: Partial<NodeType>;
  toNodeConfigId: number;
  ToNodeConfig: Partial<NodeType>;
}

export type GetEdgeTypeQueryResponseDto = Partial<EdgeType>[]

export type CreateEdgeTypeRequestDto = {
  fromNodeConfigId: number;
  toNodeConfigId: number;
}
