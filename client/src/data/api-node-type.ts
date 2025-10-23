import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { CreateNodeTypeRequestDto, GetNodeTypeQueryResponseDto } from '../../../shared/src/api/api-types-node-type.ts';

export const apiNodeType = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getNodeTypeInfo: builder.query<GetNodeTypeQueryResponseDto, void>({
    query: () => ({ url: 'get-node-type-info', method: 'POST', body: {} }),
    providesTags: ['NodeTypeInfo'],
  }),

  createNodeType: builder.mutation<void, CreateNodeTypeRequestDto>({
    query: params => ({ url: 'create-node-type', method: 'POST', body: params }),
    invalidatesTags: ['NodeTypeInfo'],
  }),
});
