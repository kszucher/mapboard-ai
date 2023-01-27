import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {actions, DefaultUseOpenWorkspaceQueryState, getSaveMapProps, RootState} from "./EditorFlow";
import {timeoutId} from "../component/WindowListeners";

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta'

const getCred = () => {
  const credString = localStorage.getItem('cred')
  // @ts-ignore
  return JSON.parse(credString.length ? credString : `{email: '', password: ''}`)
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).editor.token
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Shares'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: '', method: 'POST', body: { cred: getCred(), type: 'LIVE_DEMO' } }),
    // }),
    signIn: builder.mutation<{ cred: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { cred: getCred(), type: 'signIn' } }),
      invalidatesTags: ['Workspace']
    }),
    signOut: builder.mutation<{ data: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { cred: getCred(), type: 'signOut' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState())
      },
      invalidatesTags: []
    }),
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: '', method: 'POST', body: { cred: getCred(), type: 'openWorkspace' } }),
      async onQueryStarted(arg, { dispatch, getState }) {
        const editor = (getState() as RootState).editor
        if (editor.mapStackData.length > 1) {
          console.log('saved by listener')
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate(getSaveMapProps()))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'selectMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    selectFirstMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'selectFirstMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectPrevMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'selectPrevMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    selectNextMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'selectNextMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({query: ({ mapId, nodeId, content }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'createMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'createMapFrameImport' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'createMapFrameDuplicate' } }),
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'moveUpMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'moveDownMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'deleteMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMapFrame: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'deleteMapFrame' } }),
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, dataFrameSelected: number, mapData: any }>({query: ({ mapId, dataFrameSelected, mapData }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'saveMap', payload: { mapId, dataFrameSelected, mapData } } }),
      invalidatesTags: []
    }),
    getShares: builder.query<any, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'getShares' } }),
      providesTags: ['Shares']
    }),
    createShare: builder.mutation<void, { mapId: string, shareEmail: string, shareAccess: string}>({query: ({ mapId, shareEmail, shareAccess }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'createShare', payload: { mapId, shareEmail, shareAccess } } }),
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({query: ({ shareId }) =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'acceptShare', payload: { shareId } } }),
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({query: () =>
        ({ url: '', method: 'POST', body: { cred: getCred(), type: 'toggleColorMode' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { cred: getCred(), type: 'deleteAccount' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState())
      },
      invalidatesTags: []
    }),
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation } = api
