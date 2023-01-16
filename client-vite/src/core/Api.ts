import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const backendUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8082/beta'
  : 'https://mapboard-server.herokuapp.com/beta'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).editor.colorMode
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`)
      // }
      headers.set('authorization', localStorage.getItem('cred') as string)
      return headers
    },
  }),
  tagTypes: ['UserInfo', 'MapInfo'],
  endpoints: (builder) => ({
    // liveDemo: builder.query({
    //   query: () => ({url: '', method: 'POST', body: { type: 'LIVE_DEMO' } }),
    // }),

    signIn: builder.mutation<{ resp: any }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'signIn' } }),
      invalidatesTags: ['UserInfo', 'MapInfo']
    }),
    openUser: builder.query({
      query: () => ({ url: '', method: 'POST', body: { type: 'openUser' } } ),
      providesTags: ['UserInfo']
    }),
    openMap: builder.query<{ resp: { data: any } }, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'openMap' } }),
      providesTags: ['MapInfo']
    }),
    selectMap: builder.mutation<void, { mapId: string }>({
      query: ({ mapId }) => ( {url: '', method: 'POST', body: { type: 'selectMap', payload: { mapId } } }),
      invalidatesTags: ['MapInfo']
    }),
    selectFirstMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectFirstMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    selectPrevMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectPrevMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    selectNextMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'selectNextMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    createMapInMap: builder.mutation<void, { mapCreationProps: { content: string, nodeId: string } }>({
      query: ({ mapCreationProps }) => ( {url: '', method: 'POST', body: { type: 'createMapInMap', payload: { mapCreationProps} }}),
      invalidatesTags: ['MapInfo']
    }),
    // TODO IN TAB
    importMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'importMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    duplicateMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'duplicateMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    deleteMapFrame: builder.mutation<void, void>({
      query: () => ({ url: '', method: 'POST', body: { type: 'deleteMapFrame' } }),
      invalidatesTags: ['MapInfo']
    }),
    saveMap: builder.mutation<void, { mapId: string, dataFrameSelected: number, mapData: any }>({
      query: ({mapId, dataFrameSelected, mapData}) => ({ url: '', method: 'POST', body: { type: 'saveMap', payload: { mapId, dataFrameSelected, mapData } } }),
      invalidatesTags: []
    }),
  }),
})

export const { useOpenMapQuery } = api
