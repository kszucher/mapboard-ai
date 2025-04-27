import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export const apiMutationsTab = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  moveUpMapInTab: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({
      url: 'move-up-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
  }),

  moveDownMapInTab: builder.mutation<void, { mapId: number }>({
    query: ({ mapId }) => ({
      url: 'move-down-map-in-tab',
      method: 'POST',
      body: { mapId },
    }),
  }),
});
