import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { CreateEdgeTypeRequestDto, GetEdgeTypeQueryResponseDto } from '../../../shared/src/api/api-types-edge-type.ts';

export const apiEdgeType = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getEdgeTypeInfo: builder.query<GetEdgeTypeQueryResponseDto, void>({
    query: () => ({ url: 'get-edge-type-info', method: 'POST', body: {} }),
    providesTags: ['EdgeTypeInfo'],
  }),

  createEdgeType: builder.mutation<void, CreateEdgeTypeRequestDto>({
    query: params => ({ url: 'create-edge-type', method: 'POST', body: params }),
    invalidatesTags: ['EdgeTypeInfo'],
  }),
});
