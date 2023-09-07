import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {timeoutId} from "../component/Window"
import {getFrameId, getMapId} from "../state/NodeApiState"
import {DefaultUseOpenWorkspaceQueryState, GptData} from "../state/NodeApiStateTypes"
import {getMap} from "../state/EditorState"
import {PageState} from "../state/Enums"
import {GN} from "../state/MapStateTypes"
import {actions, RootState} from "./EditorReducer"
import {mapDeInit} from "./MapDeInit"
import {backendUrl} from "./Urls"

export const nodeApi = createApi({
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
    signIn: builder.mutation<void, void>({
      query: () => ({ url: '/beta-private', method: 'POST', body: { type: 'signIn' } }),
      invalidatesTags: ['Workspace']
    }),
    signOutEverywhere: builder.mutation<void, void>({
      query: () => ({ url: '/beta-private', method: 'POST', body: { type: 'signOutEverywhere' } }),
      invalidatesTags: []
    }),
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'openWorkspace' } }),
      async onQueryStarted(arg, { dispatch, getState }) {
        const editor = (getState() as RootState).editor
        if (editor.mapList.length > 1) {
          console.log('save by listener')
          clearTimeout(timeoutId)
          dispatch(nodeApi.endpoints.saveMap.initiate({
            mapId: getMapId(),
            frameId: getFrameId(),
            mapData: mapDeInit(getMap().filter((gn: GN) => (gn.hasOwnProperty('path') && gn.hasOwnProperty('nodeId'))))
          }))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'selectMap', payload: { mapId, frameId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({
      query: ({ mapId, nodeId, content }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInTab' } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameImport', payload: { mapId, frameId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameDuplicate', payload: { mapId, frameId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'moveUpMapInTab', payload: { mapId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'moveDownMapInTab', payload: { mapId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    deleteMapFrame: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMapFrame', payload: { mapId, frameId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, frameId: string, mapData: any }>({
      query: ({ mapId, frameId, mapData }) => ({ url: 'beta-private', method: 'POST', body: { type: 'saveMap', payload: { mapId, frameId, mapData } } }),
      invalidatesTags: []
    }),
    getShares: builder.query<any, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'getShares' } }),
      providesTags: ['Shares']
    }),
    createShare: builder.mutation<void, { mapId: string, shareEmail: string, shareAccess: string}>({
      query: ({ mapId, shareEmail, shareAccess }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createShare', payload: { mapId, shareEmail, shareAccess } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({
      query: ({ shareId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'acceptShare', payload: { shareId } } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'toggleColorMode' } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteAccount' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.setPageState(PageState.WS_LOADING))
        dispatch(actions.resetState())
        dispatch(nodeApi.util.resetApiState()
        )},
      invalidatesTags: []
    }),
    getGptSuggestions: builder.query<any, GptData>({
      query: (payload) => ({ url: 'beta-private', method: 'POST', body: { type: 'getGptSuggestions', payload } }),
      async onQueryStarted(arg, { dispatch }) {dispatch(actions.setPageState(PageState.WS_LOADING))},
    }),
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation } = nodeApi
