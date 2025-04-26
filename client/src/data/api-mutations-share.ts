import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export const apiMutationsShare = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
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
});
