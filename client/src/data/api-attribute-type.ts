import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  DeleteAttributeTypeRequestDto,
  GetAttributeTypeInfoQueryResponseDto,
  InsertAttributeTypeRequestDto,
} from '../../../shared/src/api/api-types-attribute-type.ts';

export const apiAttributeType = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getAttributeTypeInfo: builder.query<GetAttributeTypeInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-attribute-type-info', method: 'POST', body: {} }),
    providesTags: ['AttributeTypeInfo'],
  }),

  insertAttributeType: builder.mutation<void, InsertAttributeTypeRequestDto>({
    query: params => ({ url: 'insert-attribute-type', method: 'POST', body: params }),
    invalidatesTags: ['AttributeTypeInfo'],
  }),

  deleteAttributeType: builder.mutation<void, DeleteAttributeTypeRequestDto>({
    query: params => ({ url: 'delete-attribute-type', method: 'POST', body: params }),
    invalidatesTags: ['AttributeTypeInfo'],
  }),
});
