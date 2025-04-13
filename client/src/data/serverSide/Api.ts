import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from '../../urls/Urls.ts';
import { RootState } from '../store.ts';
import { apiMutations } from './ApiMutations.ts';
import { apiQueries } from './ApiQueries.ts';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token;
      const workspaceId = (getState() as RootState).editor.workspaceId;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Workspace-Id', workspaceId);
      }
      return headers;
    },
  }),
  tagTypes: ['UserInfo', 'MapInfo', 'SharesInfo'],
  endpoints: builder => ({ ...apiQueries(builder), ...apiMutations(builder) }),
});
