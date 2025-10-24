import { AttributeType, AttributeTypeUpdate } from '../schema/schema';

export type GetAttributeTypeInfoQueryResponseDto = Required<AttributeType>[]

export type InsertAttributeTypeRequestDto = Required<AttributeTypeUpdate>

export type DeleteAttributeTypeRequestDto = {
  attributeTypeId: number
}
