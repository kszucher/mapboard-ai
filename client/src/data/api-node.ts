import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  DeleteNodeRequestDto,
  InsertNodeRequestDto,
  MoveNodeRequestDto,
} from '../../../shared/src/api/api-types-map.ts';

export const apiNode = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  insertNode: builder.mutation<void, InsertNodeRequestDto>({
    query: params => ({ url: 'insert-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  deleteNode: builder.mutation<void, DeleteNodeRequestDto>({
    query: params => ({ url: 'delete-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  moveNode: builder.mutation<void, MoveNodeRequestDto>({
    query: params => ({ url: 'move-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),
});
