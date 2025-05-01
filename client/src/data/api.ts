import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from '../urls/Urls.ts';
import { apiMap } from './api-map.ts';
import { apiShare } from './api-share.ts';
import { apiTab } from './api-tab.ts';
import { apiUser } from './api-user.ts';
import { apiWorkspace } from './api-workspace.ts';
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
  tagTypes: ['UserInfo', 'MapInfo', 'TabInfo', 'ShareInfo'],
  endpoints: builder => ({
    ...apiUser(builder),
    ...apiMap(builder),
    ...apiTab(builder),
    ...apiShare(builder),
    ...apiWorkspace(builder),
  }),
});

export const { useGetUserInfoQuery, useGetMapInfoQuery, useGetTabInfoQuery, useGetShareInfoQuery } = api;
