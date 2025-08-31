import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteMapRequestDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  RenameMapRequestDto,
  UpdateMapRequestDto,
} from '../../../shared/src/api/api-types-map.ts';

export const apiMap = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getMapInfo: builder.query<GetMapInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-map-info', method: 'POST', body: {} }),
    providesTags: ['MapInfo'],
  }),

  createMapInTab: builder.mutation<void, CreateMapInTabRequestDto>({
    query: ({ mapName }) => ({
      url: 'create-map-in-tab',
      method: 'POST',
      body: { mapName },
    }),
    invalidatesTags: ['MapInfo', 'TabInfo'],
  }),

  createMapInTabDuplicate: builder.mutation<void, CreateMapInTabDuplicateRequestDto>({
    query: ({ mapId }) => ({
      url: 'create-map-in-tab-duplicate',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['MapInfo', 'TabInfo'],
  }),

  renameMap: builder.mutation<void, RenameMapRequestDto>({
    query: ({ mapId, mapName }) => ({
      url: 'rename-map',
      method: 'POST',
      body: { mapId, mapName },
    }),
    invalidatesTags: [],
  }),

  updateMap: builder.mutation<void, UpdateMapRequestDto>({
    query: ({ mapId, mapOp }) => ({
      url: 'update-map',
      method: 'POST',
      body: { mapId, mapOp },
    }),
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
    query: ({ mapId }) => ({
      url: 'execute-map',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: [],
  }),

  deleteMap: builder.mutation<void, DeleteMapRequestDto>({
    query: ({ mapId }) => ({
      url: 'delete-map',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: [],
  }),
});
