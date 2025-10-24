import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  DeleteAttributeRequestDto,
  GetAttributeInfoQueryResponseDto,
  InsertAttributeRequestDto,
} from '../../../shared/src/api/api-types-attribute.ts';

export const apiAttribute = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getAttributeInfo: builder.query<GetAttributeInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-attribute-info', method: 'POST', body: {} }),
    providesTags: ['AttributeInfo'],
  }),

  insertEdge: builder.mutation<void, InsertAttributeRequestDto>({
    query: params => ({ url: 'insert-attribute', method: 'POST', body: params }),
    invalidatesTags: ['AttributeInfo'],
  }),

  deleteEdge: builder.mutation<void, DeleteAttributeRequestDto>({
    query: params => ({ url: 'delete-attribute', method: 'POST', body: params }),
    invalidatesTags: ['AttributeInfo'],
  }),
});
