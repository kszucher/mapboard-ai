import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabRequestDto,
  DeleteMapRequestDto,
  ExecuteMapRequestDto,
  GetMapInfoQueryResponseDto,
  RenameMapRequestDto,
} from '../../../shared/src/api/api-types-map.ts';
import { timeoutId } from '../components/window/Window.tsx';
import { RootState } from './store.ts';

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

  saveMap: builder.mutation<void, { mapId: number }>({
    queryFn: async ({ mapId }, { getState }, _extraOptions, baseQuery) => {
      const slice = (getState() as unknown as RootState).slice;
      // if (slice.commitList.length > 1) {
      console.log('saving');
      clearTimeout(timeoutId);
      const SAVE_ENABLED = true;
      if (SAVE_ENABLED) {
        const mapData = slice.commitList[slice.commitIndex];
        try {
          const { data } = await baseQuery({
            url: 'save-map',
            method: 'POST',
            body: { mapId, mapData },
          });
          return { data } as { data: void };
        } catch (error) {
          return { error };
        }
      }
      // }
      return { error: 'no map' };
    },
    invalidatesTags: [],
  }),

  executeMapUploadFile: builder.mutation<void, { file: File; mapId: number; nodeId: string }>({
    query: ({ file, mapId, nodeId }) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('mapId', mapId.toString());
      bodyFormData.append('nodeId', nodeId);
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
