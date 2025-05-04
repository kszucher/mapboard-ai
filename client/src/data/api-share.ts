import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  AcceptShareRequestDto,
  CreateShareRequestDto,
  GetShareInfoQueryResponseDto,
  ModifyShareAccessRequestDto,
  RejectShareRequestDto,
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
    invalidatesTags: ['ShareInfo'],
  }),

  acceptShare: builder.mutation<void, AcceptShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'accept-share',
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
    invalidatesTags: ['ShareInfo'],
  }),

  rejectShare: builder.mutation<void, RejectShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'reject-share',
      method: 'POST',
      body: { shareId },
    }),
    invalidatesTags: ['ShareInfo'],
  }),

  modifyShareAccess: builder.mutation<void, ModifyShareAccessRequestDto>({
    query: ({ shareId, shareAccess }) => ({
      url: 'modify-share-access',
      method: 'POST',
      body: { shareId, shareAccess },
    }),
    invalidatesTags: ['ShareInfo'],
  }),
});
