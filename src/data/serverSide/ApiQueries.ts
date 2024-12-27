import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  ExtractionRawPromptDefaultState,
  MapInfoDefaultState,
  SharesInfoDefaultState,
  UserInfoDefaultState,
} from './ApiStateTypes.ts';

export const apiQueries = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getUserInfo: builder.query<UserInfoDefaultState, void>({
    query: () => ({ url: 'get-user-info', method: 'POST' }),
    providesTags: ['UserInfo'],
  }),

  getMapInfo: builder.query<MapInfoDefaultState, void>({
    query: () => ({ url: 'get-map-info', method: 'POST' }),
    providesTags: ['MapInfo'],
  }),

  getSharesInfo: builder.query<SharesInfoDefaultState, void>({
    query: () => ({ url: 'get-shares-info', method: 'POST' }),
    providesTags: ['SharesInfo'],
  }),

  getExtractionRawPrompt: builder.query<ExtractionRawPromptDefaultState, { mapId: string; nodeId: string }>({
    query: ({ mapId, nodeId }) => ({ url: 'get-extraction-raw-prompt', method: 'POST', body: { mapId, nodeId } }),
    providesTags: [],
  }),
});
