import { AttributeType } from '../schema/schema';

export type GetAttributeTypeInfoQueryResponseDto =
  Pick<AttributeType, 'id' | 'label' | 'isInput' | 'isString' | 'isNumber' | 'isEnum'>[]

export type InsertAttributeTypeRequestDto = {
  nodeId: number
}

export type DeleteAttributeTypeRequestDto = {
  attributeTypeId: number
}
