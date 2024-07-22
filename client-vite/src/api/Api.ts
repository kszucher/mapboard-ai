import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {timeoutId} from "../components/editor/Window"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState.ts"
import {DefaultGetIngestionQueryState, DefaultUseOpenWorkspaceQueryState} from "../state/ApiStateTypes.ts"
import {actions, RootState, store} from "../reducers/EditorReducer"
import {mapDeInit} from "../reducers/MapDeInit"
import {pythonBackendUrl} from "./Urls"
import {mapDiff} from "../queries/MapDiff.ts"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: pythonBackendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token
      const sessionId = (getState() as RootState).editor.sessionId
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        headers.set('Server-Session-Id', sessionId)
      }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Shares', 'IngestionData'],
  endpoints: (builder) => ({
    signIn: builder.mutation<void, void>({
      query: () => ({ url: '/sign-in', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(actions.setSessionId((data as any).sessionId))
        } catch (err) {
        }
      },
      invalidatesTags: ['Workspace']
    }),
    signOutEverywhere: builder.mutation<void, void>({
      query: () => ({ url: '/sign-out-everywhere', method: 'POST' }),
      invalidatesTags: []
    }),
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: 'open-workspace', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch {
            dispatch(api.endpoints.selectMapAvailable.initiate())
        }
      },
      providesTags: ['Workspace']
    }),
    toggleColorMode: builder.mutation<void, void>({
      query: () => ({ url: 'toggle-color-mode', method: 'POST' }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'select-map', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(actions.setIsLoading(true))
        dispatch(api.endpoints.saveMapAssembler.initiate())
      },
      invalidatesTags: ['Workspace']
    }),
    selectMapAvailable: builder.mutation<void, void>({
      query: () => ({ url: 'select-map-available', method: 'POST' }),
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
      async onQueryStarted(_, { dispatch }) {
        dispatch(actions.setIsLoading(true))
        dispatch(api.endpoints.saveMapAssembler.initiate())
      },
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
    saveMapAssembler: builder.mutation<void, void>({
      queryFn: (): any => ({ data: [] }),
      async onQueryStarted(_, { dispatch, getState }) {
        const editor = (getState() as RootState).editor
        if (editor.mapList.length > 1) {
          const ws = (api.endpoints.openWorkspace.select()(store.getState())?.data || defaultUseOpenWorkspaceQueryState)
          console.log('saving ' + ws.mapName)
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate({
            mapId: ws.mapId,
            mapDelta: mapDiff(
              mapDeInit(editor.mapList[0]),
              mapDeInit(editor.mapList[editor.mapListIndex])
            ),
          }))
        }
      }
    }),
    saveMap: builder.mutation<void, { mapId: string, mapDelta: any }>({
      query: ({ mapId, mapDelta }) => ({ url: 'save-map', method: 'POST', body: { mapId, mapDelta } }),
      invalidatesTags: []
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ({ url: 'delete-map', method: 'POST', body: { mapId } }),
      async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
      invalidatesTags: ['Workspace', 'Shares']
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
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'delete-account', method: 'POST' }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(actions.setIsLoading(true))
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState()
        )},
      invalidatesTags: []
    }),
    uploadFile: builder.mutation<void, { bodyFormData: FormData }>({
      query: ({ bodyFormData }) => ({ url: '/upload-file', method: 'POST', body: bodyFormData, formData: true }),
      invalidatesTags: ['IngestionData']
    }),
    getIngestion: builder.query<DefaultGetIngestionQueryState, void>({
      query: () => ({ url: '/get-ingestion', method: 'POST', body: {} }),
      providesTags: ['IngestionData']
    })
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation, useUploadFileMutation, useGetIngestionQuery } = api
