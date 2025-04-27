import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { api } from './api.ts';
import { actions } from './reducer.ts';

export const apiMutationsUser = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  toggleColorMode: builder.mutation<void, void>({
    query: () => ({
      url: 'toggle-color-mode',
      method: 'POST',
    }),
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
  }),
});
