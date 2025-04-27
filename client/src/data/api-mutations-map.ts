import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabDuplicateRequestDto,
  CreateMapInTabDuplicateResponseDto,
  CreateMapInTabRequestDto,
  CreateMapInTabResponseDto,
  RenameMapRequestDto,
  RenameMapResponseDto,
} from '../../../shared/src/api/api-types.ts';
import { mapPrune } from '../../../shared/src/map/getters/map-prune.ts';
import { mapArrayToObject } from '../../../shared/src/map/getters/map-queries.ts';
import { timeoutId } from '../components/window/Window.tsx';
import { RootState } from './store.ts';

export const apiMutationsMap = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  createMapInTab: builder.mutation<CreateMapInTabResponseDto, CreateMapInTabRequestDto>({
    query: ({ mapName }) => ({
      url: 'create-map-in-tab',
      method: 'POST',
      body: { mapName },
    }),
  }),

  createMapInTabDuplicate: builder.mutation<CreateMapInTabDuplicateResponseDto, CreateMapInTabDuplicateRequestDto>({
    query: ({ mapId }) => ({
      url: 'create-map-in-tab-duplicate',
      method: 'POST',
      body: { mapId },
    }),
  }),

  renameMap: builder.mutation<RenameMapResponseDto, RenameMapRequestDto>({
    query: ({ mapId, mapName }) => ({
      url: 'rename-map',
      method: 'POST',
      body: { mapId, mapName },
    }),
  }),

  saveMap: builder.mutation<void, void>({
    queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
      const slice = (getState() as unknown as RootState).slice;
      if (slice.commitList.length > 1) {
        console.log('saving');
        clearTimeout(timeoutId);
        const SAVE_ENABLED = true;
        if (SAVE_ENABLED) {
          const mapId = slice.mapInfo.id;
          const mapData = mapArrayToObject(mapPrune(slice.commitList[slice.commitIndex]));
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
      }
      return { error: 'no map' };
    },
  }),

  executeUploadFile: builder.mutation<void, { file: File; mapId: number; nodeId: string }>({
    query: ({ file, mapId, nodeId }) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('map_id', mapId.toString());
      bodyFormData.append('node_id', nodeId);
      return {
        url: '/execute-upload-file',
        method: 'POST',
        body: bodyFormData,
        formData: true,
      };
    },
  }),

  executeIngestion: builder.mutation<void, { mapId: number; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({
      url: 'execute-ingestion',
      method: 'POST',
      body: { mapId, nodeId },
    }),
  }),

  executeExtraction: builder.mutation<void, { mapId: number; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({
      url: 'execute-extraction',
      method: 'POST',
      body: { mapId, nodeId },
    }),
  }),

  executeTextOutput: builder.mutation<void, { mapId: number; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({
      url: 'execute-text-output',
      method: 'POST',
      body: { mapId, nodeId },
    }),
  }),

  deleteMap: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({
      url: 'delete-map',
      method: 'POST',
      body: { mapId },
    }),
  }),
});
