import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapInTabResponseDto,
  WorkspaceUpdateResponseDto,
  RenameMapResponseDto,
  SignInResponseDto,
  CreateMapInTabRequestDto,
  RenameMapRequestDto,
} from '../../../../shared/types/api-state-types.ts';
import { timeoutId } from '../../components/window/Window.tsx';
import { mapPrune } from '../clientSide/mapGetters/MapPrune.ts';
import { mapArrayToObject } from '../clientSide/mapGetters/MapQueries.ts';
import { actions } from '../clientSide/Reducer.ts';
import { RootState } from '../store.ts';
import { api } from './Api.ts';

export const apiMutations = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  // sign-in
  signIn: builder.mutation<SignInResponseDto, void>({
    query: () => ({ url: '/sign-in', method: 'POST' }),
  }),

  // sign-out
  signOutEverywhere: builder.mutation<void, void>({
    query: () => ({ url: '/sign-out-everywhere', method: 'POST' }),
  }),

  // user
  toggleColorMode: builder.mutation<void, void>({
    query: () => ({ url: 'toggle-color-mode', method: 'POST' }),
  }),

  // map
  createMapInTab: builder.mutation<CreateMapInTabResponseDto, CreateMapInTabRequestDto>({
    query: () => ({ url: 'create-map-in-tab', method: 'POST' }),
  }),

  createMapInTabDuplicate: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({ url: 'create-map-in-tab-duplicate', method: 'POST', body: { mapId } }),
  }),

  renameMap: builder.mutation<RenameMapResponseDto, RenameMapRequestDto>({
    query: ({ id, name }) => ({ url: 'rename-map', method: 'POST', body: { id, name } }),
  }),

  moveUpMapInTab: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({ url: 'move-up-map-in-tab', method: 'POST', body: { mapId } }),
  }),

  moveDownMapInTab: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({ url: 'move-down-map-in-tab', method: 'POST', body: { mapId } }),
  }),

  saveMap: builder.mutation<void, void>({
    queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
      const editor = (getState() as unknown as RootState).editor;
      if (editor.commitList.length > 1) {
        console.log('saving');
        clearTimeout(timeoutId);
        const SAVE_ENABLED = true;
        if (SAVE_ENABLED) {
          const mapId = editor.mapInfo.id;
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
  }),

  deleteMap: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({
      url: 'delete-map',
      method: 'POST',
      body: { mapId },
    }),
  }),

  // share
  createShare: builder.mutation<void, { mapId: number; shareEmail: string; shareAccess: string }>({
    query: ({ mapId, shareEmail, shareAccess }) => ({
      url: 'create-share',
      method: 'POST',
      body: { mapId, shareEmail, shareAccess },
    }),
  }),

  updateShareAccess: builder.mutation<void, { shareId: number }>({
    query: ({ shareId }) => ({
      url: 'update-share-access',
      method: 'POST',
      body: { shareId },
    }),
  }),

  updateShareStatusAccepted: builder.mutation<void, { shareId: number }>({
    query: ({ shareId }) => ({
      url: 'update-share-status-accepted',
      method: 'POST',
      body: { shareId },
    }),
  }),

  withdrawShare: builder.mutation<void, { shareId: number }>({
    query: ({ shareId }) => ({
      url: 'withdraw-share',
      method: 'POST',
      body: { shareId },
    }),
  }),

  rejectShare: builder.mutation<void, { shareId: number }>({
    query: ({ shareId }) => ({
      url: 'reject-share',
      method: 'POST',
      body: { shareId },
    }),
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
  }),

  // workspace
  workspaceUpdate: builder.mutation<WorkspaceUpdateResponseDto, { mapId: number }>({
    query: ({ mapId }) => ({ url: 'workspace-update', method: 'POST', body: { mapId } }),
  }),

  // llm
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
});
