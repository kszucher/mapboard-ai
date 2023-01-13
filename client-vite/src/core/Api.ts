import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getMapData} from "./MapFlow";
import {RootState, store} from "./EditorFlow";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).editor.colorMode
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      headers.set('authorization', localStorage.getItem('cred') as string)
      return headers
    },
  }),
  tagTypes: ['UserInfo', 'MapInfo', 'MapFrameInfo'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: '', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    // }),

    signIn: builder.mutation<{ resp: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'SIGN_IN' } }),
      invalidatesTags: ['UserInfo', 'MapInfo']
    }),

    openUser: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'OPEN_USER' } } ),
      providesTags: ['UserInfo']
    }),

    openMap: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'OPEN_MAP' } }),
      providesTags: ['MapInfo']
    }),

    openMapFrame: builder.query<{ resp: any }, { mapId: string }>({
      query: ({ mapId }) => ({ url: '', method: 'POST', body: { type: 'OPEN_MAP_FRAME', payload: { mapId } } }),
      providesTags: ['MapFrameInfo']
    }),

    selectMapFromTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( {url: '', method: 'POST', body: { type: 'SELECT_MAP_FROM_TAB', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),

    selectMapFromBreadcrumbs: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( { url: '', method: 'POST', body: { type: 'SELECT_MAP_FROM_BREADCRUMBS', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),

    selectMapFromMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( { url: '', method: 'POST', body: { type: 'SELECT_MAP_FROM_MAP', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),

    saveMap: builder.mutation<void, { mapId: string, mapSource: string, mapData: any }>({
      query: ({mapId, mapSource, mapData}) => ({ url: '', method: 'POST', body: { type: 'SAVE_MAP', payload: { mapId, mapSource, mapData } } }),
      invalidatesTags: []
    }),

    createMapInMap: builder.mutation<void, { mapCreationProps: { content: string, nodeId: string } }>({
      query: ({ mapCreationProps }) => ( {url: '', method: 'POST', body: { type: 'CREATE_MAP_IN_MAP', payload: { mapCreationProps} }}),
      invalidatesTags: ['MapInfo']
    }),



  }),
})

export const { useOpenMapQuery, useOpenMapFrameQuery, useSaveMapMutation } = api
