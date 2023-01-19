import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getMapSaveProps, RootState} from "./EditorFlow";
import {timeoutId} from "../component/WindowListeners";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).editor.colorMode
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      const credString = localStorage.getItem('cred')
      headers.set('authorization', credString ? credString : "{ email: '', user: ''}")
      return headers
    },
  }),
  tagTypes: ['UserInfo', 'MapInfo'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: '', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    // }),

    signIn: builder.mutation<{ resp: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'signIn' } }),
      invalidatesTags: ['UserInfo', 'MapInfo']
    }),
    openUser: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'openUser' } } ),
      providesTags: ['UserInfo']
    }),
    openMap: builder.query<{ resp: { data: any } }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'openMap' } }),
      async onQueryStarted(arg, { dispatch, getState }) {
        if ((getState() as RootState).editor.mapId !== '') {
          console.log('saved by listener')
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate(getMapSaveProps()))
        }
      },
      providesTags: ['MapInfo']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( {url: '', method: 'POST', body: { type: 'selectMap', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),
    selectFirstMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectFirstMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    selectPrevMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectPrevMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    selectNextMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectNextMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    createMapInMap: builder.mutation<void, { mapCreationProps: { content: string, nodeId: string } }>({
      query: ({ mapCreationProps }) => ({ url: '', method: 'POST', body: { type: 'createMapInMap', payload: { mapCreationProps} } }),
      invalidatesTags: ['MapInfo']
    }),
    createMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapInTab' } }),
      invalidatesTags: ['MapInfo']
    }),
    createMapFrameImport: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapFrameImport' } }),
      invalidatesTags: ['MapInfo']
    }),
    createMapFrameDuplicate: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapFrameDuplicate' } }),
      invalidatesTags: ['MapInfo']
    }),
    moveUpMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'moveUpMapInTab' } }),
      invalidatesTags: ['MapInfo']
    }),
    moveDownMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'moveDownMapInTab' } }),
      invalidatesTags: ['MapInfo']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: '', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),
    deleteMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'deleteMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    saveMap: builder.mutation<void, { mapId: string, dataFrameSelected: number, mapData: any }>({
      query: ({mapId, dataFrameSelected, mapData}) => ({ url: '', method: 'POST', body: { type: 'saveMap', payload: { mapId, dataFrameSelected, mapData } } }),
      invalidatesTags: []
    }),
  }),
})

export const { useOpenMapQuery } = api
