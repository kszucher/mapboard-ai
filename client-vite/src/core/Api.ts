import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RootState} from "./EditorFlow";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta';

export interface User {
  first_name: string
  last_name: string
}

export interface UserResponse {
  user: User
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    // prepareHeaders: (headers, { getState }) => {
    //   // By default, if we have a token in the store, let's use that for authenticated requests
    //   const token = (getState() as RootState).auth.token
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`)
    //   }
    //   return headers
    // },
  }),
  endpoints: (builder) => ({
    liveDemo: builder.query({
      query: (name: string) => ({url: ``, method: 'POST', body: {
          // @ts-ignore
          cred: JSON.parse(localStorage.getItem('cred')),
          type: 'LIVE_DEMO'
        }}),
      // TODO: use prepareHeaders instead to set up a token if needed later
      // invalidatesTags
    }),

    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: credentials,
      }),
    }),

    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),
  }),
})

export const { useLiveDemoQuery } = api
