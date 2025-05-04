import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateShareRequestDto,
  GetShareInfoQueryResponseDto,
  RejectShareRequestDto,
  UpdateShareAccessRequestDto,
  UpdateShareStatusAcceptedRequestDto,
  WithdrawShareRequestDto,
} from '../../../shared/src/api/api-types-share.ts';

export const apiShare = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getShareInfo: builder.query<GetShareInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-share-info', method: 'POST', body: {} }),
    providesTags: ['ShareInfo'],
  }),

  createShare: builder.mutation<void, CreateShareRequestDto>({
    query: ({ mapId, shareEmail, shareAccess }) => ({
      url: 'create-share',
      method: 'POST',
      body: { mapId, shareEmail, shareAccess },
    }),
    invalidatesTags: [],
  }),

  updateShareAccess: builder.mutation<void, UpdateShareAccessRequestDto>({
    query: ({ shareId, shareAccess }) => ({
      url: 'update-share-access',
      method: 'POST',
      body: { shareId, shareAccess },
    }),
    invalidatesTags: [],
  }),

  updateShareStatusAccepted: builder.mutation<void, UpdateShareStatusAcceptedRequestDto>({
    query: ({ shareId }) => ({
      url: 'update-share-status-accepted',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['ShareInfo'],
  }),

  withdrawShare: builder.mutation<void, WithdrawShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'withdraw-share',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: [],
  }),

  rejectShare: builder.mutation<void, RejectShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'reject-share',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: [],
  }),
});
