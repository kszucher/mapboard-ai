import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteEdgeRequestDto,
  DeleteMapRequestDto,
  DeleteNodeRequestDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  InsertEdgeRequestDto,
  InsertNodeRequestDto,
  MoveNodeRequestDto,
  RenameMapRequestDto,
  UpdateNodeRequestDto,
} from '../../../shared/src/api/api-types-map.ts';

export const apiMap = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getMapInfo: builder.query<GetMapInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-map-info', method: 'POST', body: {} }),
    providesTags: ['MapInfo'],
  }),

  createMapInTab: builder.mutation<void, CreateMapInTabRequestDto>({
    query: params => ({ url: 'create-map-in-tab', method: 'POST', body: params }),
    invalidatesTags: ['MapInfo', 'TabInfo'],
  }),

  createMapInTabDuplicate: builder.mutation<void, CreateMapInTabDuplicateRequestDto>({
    query: params => ({ url: 'create-map-in-tab-duplicate', method: 'POST', body: params }),
    invalidatesTags: ['MapInfo', 'TabInfo'],
  }),

  renameMap: builder.mutation<void, RenameMapRequestDto>({
    query: params => ({ url: 'rename-map', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  deleteMap: builder.mutation<void, DeleteMapRequestDto>({
    query: params => ({ url: 'delete-map', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  insertNode: builder.mutation<void, InsertNodeRequestDto>({
    query: params => ({ url: 'insert-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  insertEdge: builder.mutation<void, InsertEdgeRequestDto>({
    query: params => ({ url: 'insert-edge', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  deleteNode: builder.mutation<void, DeleteNodeRequestDto>({
    query: params => ({ url: 'delete-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  deleteEdge: builder.mutation<void, DeleteEdgeRequestDto>({
    query: params => ({ url: 'delete-edge', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  moveNode: builder.mutation<void, MoveNodeRequestDto>({
    query: params => ({ url: 'move-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  updateNode: builder.mutation<void, UpdateNodeRequestDto>({
    query: params => ({ url: 'update-node', method: 'POST', body: params }),
    invalidatesTags: [],
  }),

  executeMapUploadFile: builder.mutation<void, { file: File; mapId: number; nodeId: number }>({
    query: ({ file, mapId, nodeId }) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('mapId', mapId.toString());
      bodyFormData.append('nodeId', nodeId.toString());
      return {
        url: 'execute-map-upload-file',
        method: 'POST',
        body: bodyFormData,
        formData: true,
      };
    },
    invalidatesTags: [],
  }),

  executeMap: builder.mutation<void, ExecuteMapRequestDto>({
    query: ({ mapId }) => ({ url: 'execute-map', method: 'POST', body: { mapId } }),
    invalidatesTags: [],
  }),
});
