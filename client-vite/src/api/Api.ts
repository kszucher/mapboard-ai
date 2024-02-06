import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {timeoutId} from "../components/editor/Window"
import {getFrameId, getMapId} from "../state/NodeApiState"
import {DefaultUseOpenWorkspaceQueryState, GptData} from "../state/NodeApiStateTypes"
import {getMap} from "../state/EditorState"
import {N} from "../state/MapStateTypes"
import {actions, RootState} from "../reducers/EditorReducer"
import {mapDeInit} from "../reducers/MapDeInit"
import {nodeBackendUrl, pythonBackendUrl} from "./Urls"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: nodeBackendUrl,
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
    // NODE API
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
      async onQueryStarted(_, { dispatch, getState }) {
        const editor = (getState() as RootState).editor
        if (editor.mapList.length > 1) {
          console.log('save by listener')
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate({
            mapId: getMapId(),
            frameId: getFrameId(),
            mapData: mapDeInit(getMap().filter((n: N) => (n.hasOwnProperty('path') && n.hasOwnProperty('nodeId'))))
          }))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'selectMap', payload: { mapId, frameId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    renameMap: builder.mutation<void, { mapId: string, name: string }>({
      query: ({ mapId, name }) => ({ url: 'beta-private', method: 'POST', body: { type: 'renameMap', payload: { mapId, name } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({
      query: ({ mapId, nodeId, content }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInTab' } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInTabDuplicate: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInTabDuplicate', payload: { mapId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameImport', payload: { mapId, frameId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameDuplicate', payload: { mapId, frameId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'moveUpMapInTab', payload: { mapId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'moveDownMapInTab', payload: { mapId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    deleteMapFrame: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMapFrame', payload: { mapId, frameId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
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
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({
      query: ({ shareId }) => ({ url: 'beta-private', method: 'POST', body: { type: 'acceptShare', payload: { shareId } } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'toggleColorMode' } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteAccount' } }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(actions.setIsLoading(true))
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState()
        )},
      invalidatesTags: []
    }),
    getGptSuggestions: builder.query<any, GptData>({
      query: (payload) => ({ url: 'beta-private', method: 'POST', body: { type: 'getGptSuggestions', payload } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    }),
    // PYTHON API
    uploadFile: builder.mutation<void, { bodyFormData: FormData }>({
      query: ({ bodyFormData }) => ({
        url: pythonBackendUrl + '/upload-file',
        method: 'POST',
        body: bodyFormData,
        formData: true,
      }),
      // async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: []
    }),
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation } = api
