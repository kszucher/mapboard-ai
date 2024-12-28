import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { timeoutId } from '../../components/window/Window.tsx';
import { actions } from '../clientSide/Reducer.ts';
import { mapPrune } from '../clientSide/mapGetters/MapPrune.ts';
import { mapArrayToObject } from '../clientSide/mapGetters/MapQueries.ts';
import { RootState } from '../store.ts';
import { api } from './Api.ts';

export const apiMutations = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  signIn: builder.mutation<{ workspaceId: string }, void>({
    query: () => ({
      url: '/sign-in',
      method: 'POST',
    }),
    invalidatesTags: ['UserInfo', 'MapInfo', 'ShareInfo'],
  }),

  signOutEverywhere: builder.mutation<void, void>({
    query: () => ({
      url: '/sign-out-everywhere',
      method: 'POST',
    }),
    invalidatesTags: [],
  }),

  toggleColorMode: builder.mutation<void, void>({
    query: () => ({
      url: 'toggle-color-mode',
      method: 'POST',
    }),
    invalidatesTags: ['UserInfo'],
  }),

  selectMap: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({
      url: 'select-map',
      method: 'POST',
      body: { mapId },
    }),
    // TODO: if it fails, we need to call selectAvailableMap. (normally we call it before error as REDIS updates us!)
    invalidatesTags: ['MapInfo'],
  }),

  selectAvailableMap: builder.mutation<void, void>({
    query: () => ({
      url: 'select-available-map',
      method: 'POST',
    }),
    // TODO: if it fails, we need to let the user know no more map exists, and offer to create one
    invalidatesTags: ['MapInfo'],
  }),

  renameMap: builder.mutation<void, { mapId: string; name: string }>({
    query: ({ mapId, name }) => ({
      url: 'rename-map',
      method: 'POST',
      body: { mapId, name },
    }),
    invalidatesTags: ['UserInfo', 'MapInfo'],
  }),

  createMapInTab: builder.mutation<void, void>({
    query: () => ({
      url: 'create-map-in-tab',
      method: 'POST',
    }),
    invalidatesTags: ['UserInfo', 'MapInfo'],
  }),

  createMapInTabDuplicate: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({
      url: 'create-map-in-tab-duplicate',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['UserInfo', 'MapInfo'],
  }),

  moveUpMapInTab: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({
      url: 'move-up-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['UserInfo'],
  }),

  moveDownMapInTab: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({
      url: 'move-down-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['UserInfo'],
  }),

  saveMap: builder.mutation<void, void>({
    queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
      const editor = (getState() as unknown as RootState).editor;
      if (editor.commitList.length > 1) {
        console.log('saving');
        clearTimeout(timeoutId);
        const SAVE_ENABLED = true;
        if (SAVE_ENABLED) {
          const mapId = editor.mapId;
          const mapData = mapArrayToObject(mapPrune(editor.commitList[editor.commitIndex]));
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
    invalidatesTags: [], // no direct invalidation
  }),

  deleteMap: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({
      url: 'delete-map',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: [], // no direct invalidation
  }),

  createShare: builder.mutation<void, { mapId: string; shareEmail: string; shareAccess: string }>({
    query: ({ mapId, shareEmail, shareAccess }) => ({
      url: 'create-share',
      method: 'POST',
      body: {
        mapId,
        shareEmail,
        shareAccess,
      },
    }),
    invalidatesTags: ['SharesInfo'],
  }),

  updateShareAccess: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({
      url: 'update-share-access',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['SharesInfo'],
  }),

  updateShareStatusAccepted: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({
      url: 'update-share-status-accepted',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['SharesInfo'],
  }),

  withdrawShare: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({
      url: 'withdraw-share',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['SharesInfo'],
  }),

  rejectShare: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({
      url: 'reject-share',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['SharesInfo'],
  }),

  deleteAccount: builder.mutation<void, void>({
    query: () => ({
      url: 'delete-account',
      method: 'POST',
    }),
    async onQueryStarted(_, { dispatch }) {
      dispatch(actions.resetState());
      dispatch(api.util.resetApiState());
    },
    invalidatesTags: [],
  }),

  uploadFile: builder.mutation<void, { file: File; mapId: string; nodeId: string }>({
    query: ({ file, mapId, nodeId }) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      bodyFormData.append('map_id', mapId);
      bodyFormData.append('node_id', nodeId);
      return {
        url: '/upload-file',
        method: 'POST',
        body: bodyFormData,
        formData: true,
      };
    },
    invalidatesTags: [],
  }),

  executeIngestion: builder.mutation<void, { mapId: string; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({
      url: 'execute-ingestion',
      method: 'POST',
      body: { mapId, nodeId },
    }),
    invalidatesTags: [],
  }),

  executeExtraction: builder.mutation<void, { mapId: string; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({
      url: 'execute-extraction',
      method: 'POST',
      body: { mapId, nodeId },
    }),
    invalidatesTags: [],
  }),
});
