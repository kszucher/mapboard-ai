import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {actions, DefaultUseOpenWorkspaceQueryState, getSaveMapProps, RootState} from "./EditorFlow";
import {timeoutId} from "../component/WindowListeners";
import {backendUrl} from "./Url";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Shares'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: 'beta-public', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    // }),
    signIn: builder.mutation<{ cred: any }, void>({
      query: () => ({ url: '/beta-private', method: 'POST', body: { type: 'signIn' } }),
      invalidatesTags: ['Workspace']
    }),
    signOut: builder.mutation<{ data: any }, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'signOut' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState())
      },
      invalidatesTags: []
    }),
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'openWorkspace' } }),
      async onQueryStarted(arg, { dispatch, getState, getCacheEntry }) {
        const editor = (getState() as RootState).editor
        if (editor.mapStackData.length > 1) {
          console.log('saved by listener')
          clearTimeout(timeoutId)

          // TODO try to access mapId through this syntax
          // if possible, we can get rid of copying data to local state
          // https://redux-toolkit.js.org/rtk-query/usage/usage-without-react-hooks

          dispatch(api.endpoints.saveMap.initiate(getSaveMapProps()))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'selectMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    selectFirstMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'selectFirstMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectPrevMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'selectPrevMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectNextMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'selectNextMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({query: ({ mapId, nodeId, content }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameImport' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameDuplicate' } }),
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'moveUpMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'moveDownMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, dataFrameSelected: number, mapData: any }>({query: ({ mapId, dataFrameSelected, mapData }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'saveMap', payload: { mapId, dataFrameSelected, mapData } } }),
      invalidatesTags: []
    }),
    getShares: builder.query<any, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'getShares' } }),
      providesTags: ['Shares']
    }),
    createShare: builder.mutation<void, { mapId: string, shareEmail: string, shareAccess: string}>({query: ({ mapId, shareEmail, shareAccess }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createShare', payload: { mapId, shareEmail, shareAccess } } }),
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({query: ({ shareId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'acceptShare', payload: { shareId } } }),
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'toggleColorMode' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteAccount' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState())
      },
      invalidatesTags: []
    }),
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation } = api
