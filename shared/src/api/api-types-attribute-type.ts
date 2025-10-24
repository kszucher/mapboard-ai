import { AttributeType, AttributeTypeUncheckedUpdateInput } from '../schema/schema';

export type GetAttributeTypeInfoQueryResponseDto =
  Pick<AttributeType, 'id' | 'nodeTypeId' | 'label' | 'isInput' | 'isString' | 'isNumber' | 'isEnum'>[]

export type InsertAttributeTypeRequestDto = Required<AttributeTypeUncheckedUpdateInput>

export type DeleteAttributeTypeRequestDto = {
  attributeTypeId: number
}
