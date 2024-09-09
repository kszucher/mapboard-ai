import {api} from "../api/Api.ts"
import {BaseQueryFn, EndpointBuilder} from "@reduxjs/toolkit/query"
import {actions, RootState} from "../editorMutations/EditorMutations.ts"
import {timeoutId} from "../componentsEditor/Window.tsx"
import {mapPrune} from "../mapQueries/MapPrune.ts"
import {mapDiff} from "../mapQueries/MapDiff.ts"
import {getMapId} from "../editorQueries/EditorQueries.ts"

export const apiMutations = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
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
  renameMap: builder.mutation<void, { name: string }>({
    query: ({ name }) => ({ url: 'rename-map', method: 'POST', body: { mapId: getMapId(), name } }),
    async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    invalidatesTags: ['Workspace']
  }),
  createMapInMap: builder.mutation<void, { nodeId: string,  content: string }>({
    query: ({ nodeId, content }) => ({ url: 'create-map-in-map', method: 'POST', body: { mapId: getMapId(), nodeId, content} }),
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
  createMapInTabDuplicate: builder.mutation<void, void>({
    query: () => ({ url: 'create-map-in-tab-duplicate', method: 'POST', body: { mapId: getMapId() } }),
    async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    invalidatesTags: ['Workspace']
  }),
  moveUpMapInTab: builder.mutation<void, void>({
    query: () => ({ url: 'move-up-map-in-tab', method: 'POST', body: { mapId: getMapId() } }),
    async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    invalidatesTags: ['Workspace']
  }),
  moveDownMapInTab: builder.mutation<void, void>({
    query: () => ({ url: 'move-down-map-in-tab', method: 'POST', body: { mapId: getMapId() } }),
    async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    invalidatesTags: ['Workspace']
  }),
  saveMapAssembler: builder.mutation<void, void>({
    queryFn: (): any => ({ data: [] }),
    async onQueryStarted(_, { dispatch, getState }) {
      const editor = (getState() as unknown as RootState).editor
      if (editor.commitList.length > 1) {
        console.log('saving')
        clearTimeout(timeoutId)
        const SAVE_ENABLED = true
        if (SAVE_ENABLED) {
          const lastSavedCommitData = editor.lastSavedCommit.data
          const lastSavedCommitId = editor.lastSavedCommit.commitId
          const commitData = mapPrune(editor.commitList[editor.commitIndex].data)
          const commitId = editor.commitList[editor.commitIndex].commitId
          const diff = mapDiff(lastSavedCommitData, commitData)
          dispatch(actions.saveCommit({
            data: structuredClone(commitData),
            commitId
          }))
          dispatch(api.endpoints.saveMap.initiate({
            mapId: editor.mapId,
            mapDelta: diff,
            lastSavedCommitId,
            commitId,
          }))
        }
      }
    }
  }),
  saveMap: builder.mutation<{ commitId: string }, { mapId: string, mapDelta: any, lastSavedCommitId: string, commitId: string }>({
    query: ({ mapId, mapDelta, lastSavedCommitId, commitId }) => ({ url: 'save-map', method: 'POST', body: { mapId, mapDelta, lastSavedCommitId, commitId } }),
    invalidatesTags: []
  }),
  deleteMap: builder.mutation<void, void>({
    query: () => ({ url: 'delete-map', method: 'POST', body: { mapId: getMapId() } }),
    async onQueryStarted(_, { dispatch }) {dispatch(actions.setIsLoading(true))},
    invalidatesTags: ['Workspace', 'Shares']
  }),
  createShare: builder.mutation<void, { shareEmail: string, shareAccess: string}>({
    query: ({ shareEmail, shareAccess }) => ({ url: 'create-share', method: 'POST', body: { mapId: getMapId(), shareEmail, shareAccess } }),
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
  })
})
