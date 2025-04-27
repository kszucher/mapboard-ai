import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateShareRequestDto,
  CreateShareResponseDto,
  RejectShareRequestDto,
  RejectShareResponseDto,
  UpdateShareAccessRequestDto,
  UpdateShareAccessResponseDto,
  UpdateShareStatusAcceptedRequestDto,
  UpdateShareStatusAcceptedResponseDto,
  WithdrawShareRequestDto,
  WithdrawShareResponseDto,
} from '../../../shared/src/api/api-types.ts';

export const apiMutationsShare = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  createShare: builder.mutation<CreateShareResponseDto, CreateShareRequestDto>({
    query: ({ mapId, shareEmail, shareAccess }) => ({
      url: 'create-share',
      method: 'POST',
      body: { mapId, shareEmail, shareAccess },
    }),
  }),

  updateShareAccess: builder.mutation<UpdateShareAccessResponseDto, UpdateShareAccessRequestDto>({
    query: ({ shareId }) => ({
      url: 'update-share-access',
      method: 'POST',
      body: { shareId },
    }),
  }),

  updateShareStatusAccepted: builder.mutation<
    UpdateShareStatusAcceptedResponseDto,
    UpdateShareStatusAcceptedRequestDto
  >({
    query: ({ shareId }) => ({
      url: 'update-share-status-accepted',
      method: 'POST',
      body: { shareId },
    }),
  }),

  withdrawShare: builder.mutation<WithdrawShareResponseDto, WithdrawShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'withdraw-share',
      method: 'POST',
      body: { shareId },
    }),
  }),

  rejectShare: builder.mutation<RejectShareResponseDto, RejectShareRequestDto>({
    query: ({ shareId }) => ({
      url: 'reject-share',
      method: 'POST',
      body: { shareId },
    }),
  }),
});
