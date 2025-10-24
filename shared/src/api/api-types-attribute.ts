import { Attribute } from '../schema/schema';

export type GetAttributeInfoQueryResponseDto = Pick<Attribute, 'id' | 'value'> []

export type InsertAttributeRequestDto = {
  nodeId: number
}

export type DeleteAttributeRequestDto = {
  attributeId: number
}
