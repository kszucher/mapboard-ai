import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { GetUserInfoQueryResponseDto } from '../../../shared/src/api/api-types-user.ts';
import { api } from './api.ts';
import { actions } from './reducer.ts';

export const apiUser = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getUserInfo: builder.query<GetUserInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-user-info', method: 'POST', body: {} }),
    providesTags: ['UserInfo'],
  }),

  toggleColorMode: builder.mutation<void, void>({
    query: () => ({
      url: 'toggle-color-mode',
      method: 'POST',
    }),
    invalidatesTags: [],
  }),

  deleteAccount: builder.mutation<void, void>({
    query: () => ({
      url: 'delete-account',
      method: 'POST',
    }),
    async onQueryStarted(_, { dispatch }) {
      dispatch(actions.resetState());
      dispatch(api.util.resetApiState());
    },
    invalidatesTags: [],
  }),
});
