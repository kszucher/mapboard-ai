import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  GetTabInfoQueryResponseDto,
  MoveDownMapInTabRequestDto,
  MoveUpMapInTabRequestDto,
} from '../../../shared/src/api/api-types-tab.ts';

export const apiTab = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getTabInfo: builder.query<GetTabInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-tab-info', method: 'POST', body: {} }),
    providesTags: ['TabInfo'],
  }),

  moveUpMapInTab: builder.mutation<void, MoveUpMapInTabRequestDto>({
    query: ({ mapId }) => ({
      url: 'move-up-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['TabInfo'],
  }),

  moveDownMapInTab: builder.mutation<void, MoveDownMapInTabRequestDto>({
    query: ({ mapId }) => ({
      url: 'move-down-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['TabInfo'],
  }),
});
