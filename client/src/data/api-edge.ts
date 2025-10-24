import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { DeleteEdgeRequestDto, InsertEdgeRequestDto } from '../../../shared/src/api/api-types-edge.ts';

export const apiEdge = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  insertEdge: builder.mutation<void, InsertEdgeRequestDto>({
    query: params => ({ url: 'insert-edge', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  deleteEdge: builder.mutation<void, DeleteEdgeRequestDto>({
    query: params => ({ url: 'delete-edge', method: 'POST', body: params }),
    invalidatesTags: [],
  }),
});
