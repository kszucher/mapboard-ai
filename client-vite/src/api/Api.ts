import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {timeoutId} from "../components/editor/Window"
import {getFrameId, getMapId} from "../state/NodeApiState"
import {DefaultGetIngestionQueryState, DefaultUseOpenWorkspaceQueryState} from "../state/NodeApiStateTypes"
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
  tagTypes: ['Workspace', 'Shares', 'IngestionData'],
  endpoints: (builder) => ({
    // NODE API
    signIn: builder.mutation<void, void>({
      query: () => ({ url: '/sign-in', method: 'POST' }),
      invalidatesTags: ['Workspace']
    }),
    signOutEverywhere: builder.mutation<void, void>({
      query: () => ({ url: '/sign-out-everywhere', method: 'POST' }),
      invalidatesTags: []
    }),
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: 'open-workspace', method: 'POST' }),
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
      query: ({ mapId, frameId }) => ({ url: 'select-map', method: 'POST', body: { mapId, frameId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    renameMap: builder.mutation<void, { mapId: string, name: string }>({
      query: ({ mapId, name }) => ({ url: 'rename-map', method: 'POST', body: { mapId, name } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({
      query: ({ mapId, nodeId, content }) => ({ url: 'create-map-in-map', method: 'POST', body: { mapId, nodeId, content} }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({
      query: () => ({ url: 'create-map-in-tab', method: 'POST' }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapInTabDuplicate: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'create-map-in-tab-duplicate', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'create-map-frame-import', method: 'POST', body: { mapId, frameId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'create-map-frame-duplicate', method: 'POST', body: { mapId, frameId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'move-up-map-in-tab', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'move-down-map-in-tab', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'delete-map', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    deleteMapFrame: builder.mutation<void, { mapId: string, frameId: string }>({
      query: ({ mapId, frameId }) => ({ url: 'delete-map-frame', method: 'POST', body: { mapId, frameId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, frameId: string, mapData: any }>({
      query: ({ mapId, frameId, mapData }) => ({ url: 'save-map', method: 'POST', body: { mapId, frameId, mapData } }),
      invalidatesTags: []
    }),
    getShares: builder.query<any, void>({
      query: () => ({ url: 'get-shares', method: 'POST' }),
      providesTags: ['Shares']
    }),
    createShare: builder.mutation<void, { mapId: string, shareEmail: string, shareAccess: string}>({
      query: ({ mapId, shareEmail, shareAccess }) => ({ url: 'create-share', method: 'POST', body: { mapId, shareEmail, shareAccess } }),
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({
      query: ({ shareId }) => ({ url: 'accept-share', method: 'POST', body: { shareId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    deleteShare: builder.mutation<void, { shareId: string }>({
      query: ({ shareId }) => ({ url: 'delete-share', method: 'POST', body: { shareId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({
      query: () => ({ url: 'toggle-color-mode', method: 'POST' }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'delete-account', method: 'POST' }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(actions.setIsLoading(true))
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState()
        )},
      invalidatesTags: []
    }),
    // PYTHON API
    saveMapDiff: builder.mutation<void, { mapId: string, frameId: string, mapDiffData: any }>({
      query: ({ mapId, frameId, mapDiffData }) => ({ url: 'save-map-diff', method: 'POST', body: { mapId, frameId, mapDiffData } }),
      invalidatesTags: []
    }),
    uploadFile: builder.mutation<void, { bodyFormData: FormData }>({
      query: ({ bodyFormData }) => ({ url: pythonBackendUrl + '/upload-file', method: 'POST', body: bodyFormData, formData: true }),
      invalidatesTags: ['IngestionData']
    }),
    getIngestion: builder.query<DefaultGetIngestionQueryState, void>({
      query: () => ({ url: pythonBackendUrl + '/get-ingestion', method: 'POST', body: {} }),
      providesTags: ['IngestionData']
    })
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation, useUploadFileMutation, useGetIngestionQuery } = api
