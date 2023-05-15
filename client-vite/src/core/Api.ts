import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {actions, RootState} from "../editor/EditorReducer"
import {timeoutId} from "../component/WindowListeners"
import {backendUrl} from "./Urls"
import {DefaultUseOpenWorkspaceQueryState} from "../state/ApiStateTypes";
import {getFrameId, getMapId} from "../state/ApiState";
import {getMap} from "../state/EditorState";
import {mapDeInit} from "../map/MapDeInit";

export const api = createApi({
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
    openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'openWorkspace' } }),
      async onQueryStarted(arg, { dispatch, getState }) {
        const editor = (getState() as RootState).editor
        if (editor.mapList.length > 1) {
          console.log('saved by listener')
          clearTimeout(timeoutId)
          dispatch(api.endpoints.saveMap.initiate({ mapId: getMapId(), frameId: getFrameId(), mapData: mapDeInit(getMap()) }))
        }
      },
      providesTags: ['Workspace']
    }),
    selectMap: builder.mutation<void, { mapId: string, frameId: string }>({query: ({ mapId, frameId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'selectMap', payload: { mapId, frameId } } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInMap: builder.mutation<void, { mapId: string, nodeId: string,  content: string }>({query: ({ mapId, nodeId, content }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInMap', payload: { mapId, nodeId, content} } }),
      invalidatesTags: ['Workspace']
    }),
    createMapInTab: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapInTab' } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameImport: builder.mutation<void, { mapId: string, frameId: string }>({query: ({ mapId, frameId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameImport', payload: { mapId, frameId } } }),
      invalidatesTags: ['Workspace']
    }),
    createMapFrameDuplicate: builder.mutation<void, { mapId: string, frameId: string }>({query: ({ mapId, frameId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createMapFrameDuplicate', payload: { mapId, frameId } } }),
      invalidatesTags: ['Workspace']
    }),
    moveUpMapInTab: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'moveUpMapInTab', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    moveDownMapInTab: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'moveDownMapInTab', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMap: builder.mutation<void, { mapId: string }>({query: ({ mapId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMap', payload: { mapId } } }),
      invalidatesTags: ['Workspace']
    }),
    deleteMapFrame: builder.mutation<void, { mapId: string, frameId: string }>({query: ({ mapId, frameId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'deleteMapFrame', payload: { mapId, frameId } } }),
      invalidatesTags: ['Workspace']
    }),
    saveMap: builder.mutation<void, { mapId: string, frameId: string, mapData: any }>({query: ({ mapId, frameId, mapData }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'saveMap', payload: { mapId, frameId, mapData } } }),
      invalidatesTags: []
    }),
    getShares: builder.query<any, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'getShares' } }),
      providesTags: ['Shares']
    }),
    createShare: builder.mutation<void, { mapId: string, shareEmail: string, shareAccess: string}>({query: ({ mapId, shareEmail, shareAccess }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'createShare', payload: { mapId, shareEmail, shareAccess } } }),
      invalidatesTags: ['Shares']
    }),
    acceptShare: builder.mutation<void, { shareId: string }>({query: ({ shareId }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'acceptShare', payload: { shareId } } }),
      invalidatesTags: ['Workspace', 'Shares']
    }),
    toggleColorMode: builder.mutation<void, void>({query: () =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'toggleColorMode' } }),
      invalidatesTags: ['Workspace']
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: 'beta-private', method: 'POST', body: { type: 'deleteAccount' } }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(actions.resetState())
        dispatch(api.util.resetApiState())
      },
      invalidatesTags: []
    }),
    getGptSuggestions: builder.query<any, { context: string, numNodes: number, content: string }>({query: ({ context, numNodes, content }) =>
        ({ url: 'beta-private', method: 'POST', body: { type: 'getGptSuggestions', payload: { context, numNodes, content } } })
    }),
  })
})

export const { useOpenWorkspaceQuery, useGetSharesQuery, useCreateShareMutation } = api
