import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { FC } from 'react'
import { Provider } from "react-redux"
import { apiMutations } from "../apiMutations/ApiMutations.ts"
import { apiQueries } from "../apiQueries/ApiQueries.ts"
import { editorSlice } from "../editorMutations/EditorMutations.ts"
import { RootAuthComponent } from "../rootAuthComponent/RootAuthComponent.tsx"
import { backendUrl } from "../urls/Urls.ts"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).editor.token
      const workspaceId = (getState() as RootState).editor.workspaceId
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        headers.set('Workspace-Id', workspaceId)
      }
      return headers
    },
  }),
  tagTypes: ['Workspace', 'Shares', 'IngestionData'],
  endpoints: (builder) => ({ ...apiQueries(builder), ...apiMutations(builder) })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery } = api
export const { useCreateShareMutation, useUploadFileMutation, useGetIngestionQuery } = api

export const appStore = configureStore({
  reducer: combineReducers({ api: api.reducer, editor: editorSlice.reducer }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware)
})

export type RootState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch


export const RootComponent: FC = () => {
  return (
    <Provider store={appStore}>
      <RootAuthComponent/>
    </Provider>
  )
}
