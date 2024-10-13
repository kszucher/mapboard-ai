import {Auth0Provider} from "@auth0/auth0-react"
import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {FC} from 'react'
import {useSelector} from "react-redux"
import {apiMutations} from "../apiMutations/ApiMutations.ts"
import {apiQueries} from "../apiQueries/ApiQueries.ts"
import {Editor} from "../componentsEditor/Editor.tsx"
import {Landing} from "../componentsLanding/Landing.tsx"
import {PageState} from "../consts/Enums.ts"
import {editorSlice} from "../editorMutations/EditorMutations.ts"
import {pythonBackendUrl} from "../urls/Urls.ts"

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: pythonBackendUrl,
    prepareHeaders: (headers, {getState}) => {
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

export const appStore = configureStore({
  reducer: combineReducers({api: api.reducer, editor: editorSlice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(api.middleware)
})

export type RootState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch


export const RootComponent: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  return (
    <Auth0Provider
      domain="mapboard.eu.auth0.com"
      clientId="tUtOWoIYJQzJqh4jr1pwGOCmRzK2SFZH"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://mapboard.eu.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata"
      }}
    >
      {pageState === PageState.AUTH && <Landing/>}
      {pageState === PageState.WS && <Editor/>}
    </Auth0Provider>
  )
}
