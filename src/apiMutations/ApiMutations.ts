import {api} from "../api/Api.ts"
import {BaseQueryFn, EndpointBuilder} from "@reduxjs/toolkit/query"
import {actions, RootState} from "../editorMutations/EditorMutations.ts"
import {timeoutId} from "../componentsEditor/Window.tsx"
import {mapPrune} from "../mapQueries/MapPrune.ts"
import {mapDiff} from "../mapQueries/MapDiff.ts"
import {getMapId} from "../editorQueries/EditorQueries.ts"

export const apiMutations = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  signIn: builder.mutation<{ connectionId: string }, void>({
    query: () => ({ url: '/sign-in', method: 'POST' }),
    invalidatesTags: ['Workspace']
  }),
  signOutEverywhere: builder.mutation<void, void>({
    query: () => ({ url: '/sign-out-everywhere', method: 'POST' }),
    invalidatesTags: []
  }),
  toggleColorMode: builder.mutation<void, void>({
    query: () => ({ url: 'toggle-color-mode', method: 'POST' }),
    invalidatesTags: ['Workspace']
  }),
  selectMap: builder.mutation<void, { mapId: string }>({
    query: ({ mapId }) => ({ url: 'select-map', method: 'POST', body: { mapId } }),
    async onQueryStarted(_, { dispatch }) {
      await dispatch(api.endpoints.saveMap.initiate())
    },
    invalidatesTags: ['Workspace']
  }),
  renameMap: builder.mutation<void, { name: string }>({
    query: ({ name }) => ({ url: 'rename-map', method: 'POST', body: { mapId: getMapId(), name } }),
    invalidatesTags: ['Workspace']
  }),
  createMapInMap: builder.mutation<void, { nodeId: string,  content: string }>({
    query: ({ nodeId, content }) => ({ url: 'create-map-in-map', method: 'POST', body: { mapId: getMapId(), nodeId, content} }),
    async onQueryStarted(_, { dispatch }) {
      await dispatch(api.endpoints.saveMap.initiate())
    },
    invalidatesTags: ['Workspace']
  }),
  createMapInTab: builder.mutation<void, void>({
    query: () => ({ url: 'create-map-in-tab', method: 'POST' }),
    invalidatesTags: ['Workspace']
  }),
  createMapInTabDuplicate: builder.mutation<void, void>({
    query: () => ({ url: 'create-map-in-tab-duplicate', method: 'POST', body: { mapId: getMapId() } }),
    invalidatesTags: ['Workspace']
  }),
  moveUpMapInTab: builder.mutation<void, void>({
    query: () => ({ url: 'move-up-map-in-tab', method: 'POST', body: { mapId: getMapId() } }),
    invalidatesTags: ['Workspace']
  }),
  moveDownMapInTab: builder.mutation<void, void>({
    query: () => ({ url: 'move-down-map-in-tab', method: 'POST', body: { mapId: getMapId() } }),
    invalidatesTags: ['Workspace']
  }),
  saveMap: builder.mutation<void, void>({
    queryFn: async (_args, { dispatch, getState }, _extraOptions, baseQuery) => {
      const editor = (getState() as unknown as RootState).editor
      if (editor.commitList.length > 1) {
        console.log('saving')
        clearTimeout(timeoutId)
        const SAVE_ENABLED = true
        if (SAVE_ENABLED) {
          const mapId = editor.mapId
          const mapDelta = mapDiff(editor.latestMapData, mapPrune(editor.commitList[editor.commitIndex]))
          try {
            const { data } = await baseQuery({url: 'save-map', method: 'POST', body: { mapId, mapDelta }})
            dispatch(api.endpoints.getLatestMerged.initiate())
            return { data } as { data: void }
          } catch (error) {
            return { error }
          }
        }
      }
      return { error: 'no map' }
    },
    invalidatesTags: ['LatestMerged']
  }),
  deleteMap: builder.mutation<void, void>({
    query: () => ({ url: 'delete-map', method: 'POST', body: { mapId: getMapId() } }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      try {
        await queryFulfilled
        dispatch(api.endpoints.selectMap.initiate({ mapId: ''}))
      } catch (err) {
        console.warn(err)
      }
    },
    invalidatesTags: ['Workspace', 'Shares']
  }),
  createShare: builder.mutation<void, { shareEmail: string, shareAccess: string}>({
    query: ({ shareEmail, shareAccess }) => ({ url: 'create-share', method: 'POST', body: { mapId: getMapId(), shareEmail, shareAccess } }),
    invalidatesTags: ['Shares']
  }),
  acceptShare: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({ url: 'accept-share', method: 'POST', body: { shareId } }),
    invalidatesTags: ['Workspace', 'Shares']
  }),
  deleteShare: builder.mutation<void, { shareId: string }>({
    query: ({ shareId }) => ({ url: 'delete-share', method: 'POST', body: { shareId } }),
    invalidatesTags: ['Workspace', 'Shares']
  }),
  deleteAccount: builder.mutation<void, void>({
    query: () => ({ url: 'delete-account', method: 'POST' }),
    async onQueryStarted(_, { dispatch }) {
      dispatch(actions.resetState())
      dispatch(api.util.resetApiState()
      )},
    invalidatesTags: []
  }),
  uploadFile: builder.mutation<void, { bodyFormData: FormData }>({
    query: ({ bodyFormData }) => ({ url: '/upload-file', method: 'POST', body: bodyFormData, formData: true }),
    invalidatesTags: ['IngestionData']
  })
})
