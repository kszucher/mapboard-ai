import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {getMapSaveProps, RootState} from "./EditorFlow";
import {timeoutId} from "../component/WindowListeners";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    mode: 'no-cors',
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
  tagTypes: ['UserInfo', 'Workspace'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: '', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    // }),

    signIn: builder.mutation<{ resp: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'signIn' } }),
      invalidatesTags: ['Workspace']
    }),
    openWorkspace: builder.query<{ resp: { data: any } }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'openWorkspace' } }),
      async onQueryStarted(arg, { dispatch, getState }) {
        if ((getState() as RootState).editor.mapId !== '') {
          console.log('saved by listener')
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate(getMapSaveProps()))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( {url: '', method: 'POST', body: { type: 'selectMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    selectFirstMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectFirstMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectPrevMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectPrevMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectNextMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectNextMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({
      query: ({ mapId, nodeId, content }) => ({ url: '', method: 'POST', body: { type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapFrameImport' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'createMapFrameDuplicate' } }),
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'moveUpMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'moveDownMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: '', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'deleteMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, dataFrameSelected: number, mapData: any }>({
      query: ({mapId, dataFrameSelected, mapData}) => ({ url: '', method: 'POST', body: { type: 'saveMap', payload: { mapId, dataFrameSelected, mapData } } }),
      invalidatesTags: []
    }),
  }),
})

export const { useOpenWorkspaceQuery } = api
