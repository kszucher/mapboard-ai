import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from '../urls/Urls.ts';
import { apiMutationsMap } from './api-mutations-map.ts';
import { apiMutationsShare } from './api-mutations-share.ts';
import { apiMutationsTab } from './api-mutations-tab.ts';
import { apiMutationsUser } from './api-mutations-user.ts';
import { apiMutationsWorkspace } from './api-mutations-workspace.ts';
import { RootState } from './store.ts';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).slice.token;
      const workspaceId = (getState() as RootState).slice.workspaceId;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Workspace-Id', workspaceId.toString());
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: builder => ({
    ...apiMutationsUser(builder),
    ...apiMutationsMap(builder),
    ...apiMutationsTab(builder),
    ...apiMutationsShare(builder),
    ...apiMutationsWorkspace(builder),
  }),
});
