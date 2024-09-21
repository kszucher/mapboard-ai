import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {RootState} from "../editorMutations/EditorMutations.ts"
import {pythonBackendUrl} from "../urls/Urls.ts"
import {apiQueries} from "../apiQueries/ApiQueries.ts"
import {apiMutations} from "../apiMutations/ApiMutations.ts"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: pythonBackendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token
      const connectionId = (getState() as RootState).editor.connectionId
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        headers.set('Connection-Id', connectionId)
      }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Shares', 'IngestionData'],
  endpoints: (builder) => ({...apiQueries(builder), ...apiMutations(builder)})
})

export const { useOpenWorkspaceQuery, useGetSharesQuery } = api
export const { useCreateShareMutation, useUploadFileMutation, useGetIngestionQuery } = api
