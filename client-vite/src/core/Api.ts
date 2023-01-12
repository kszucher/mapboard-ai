import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {RootState, store} from "./EditorFlow";
import {select} from "redux-saga/effects";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta';

// TODO plan: this week will be about finishing migrating to using RTK with a hook to move forward with sessions, auth, etc.

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.token
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      headers.set('authorization', localStorage.getItem('cred') as string)
      return headers
    },
  }),
  tagTypes: ['UserInfo', 'MapInfo', 'MapFrameInfo'],
  endpoints: (builder) => ({
    liveDemo: builder.query({
      query: () => ({url: '', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    }),

    signIn: builder.mutation<{ resp: any }, { email: string, password: string }>({
      query: ({ email, password }) => ({ url: '', method: 'POST', body: { type: 'SIGN_IN', payload: { email, password } } }),
      invalidatesTags: ['MapInfo']
    }),

    selectMapFromTab: builder.mutation<void, { mapId: string }>({
      query: ( { mapId } ) => ( {url: '', method: 'POST', body: { type: 'SELECT_MAP_FROM_TAB', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),

    openUser: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'OPEN_USER' } } ),
      providesTags: ['UserInfo']
    }),

    openMap: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'OPEN_MAP', payload: { mapSource: 'dataHistory' } } }),
      providesTags: ['MapInfo']
    }),

    openMapFrame: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'OPEN_MAP', payload: { mapSource: 'dataFrames' } } }),
      providesTags: ['MapFrameInfo']
    }),

    saveMap: builder.mutation<void, { mapId: string, mapSource: string, mapData: any }>({
      query: ({mapId, mapSource, mapData}) => ({url: '', method: 'POST', body: {
          type: 'SAVE_MAP',
          payload: {
            mapId,
            mapSource,
            mapData
          }
        },
      }),
      invalidatesTags: []
    }),

    createMapInMap: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
      invalidatesTags: []
    }),
  }),
})

export const { useLiveDemoQuery, useOpenMapQuery, useSaveMapMutation } = api
