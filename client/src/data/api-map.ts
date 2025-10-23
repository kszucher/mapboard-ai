import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteMapRequestDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  RenameMapRequestDto,
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

  executeMap: builder.mutation<void, ExecuteMapRequestDto>({
    query: ({ mapId }) => ({ url: 'execute-map', method: 'POST', body: { mapId } }),
    invalidatesTags: [],
  }),
});
