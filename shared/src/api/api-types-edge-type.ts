import { EdgeType } from '../schema/schema';

export type GetEdgeTypeQueryResponseDto = Partial<EdgeType>[]

export type CreateEdgeTypeRequestDto = {
  fromNodeTypeId: number;
  toNodeTypeId: number;
}
