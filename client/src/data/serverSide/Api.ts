import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from '../../urls/Urls.ts';
import { RootState } from '../store.ts';
import { apiMutations } from './ApiMutations.ts';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token;
      const workspaceId = (getState() as RootState).editor.workspaceId;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Workspace-Id', workspaceId.toString());
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: builder => ({ ...apiMutations(builder) }),
});
