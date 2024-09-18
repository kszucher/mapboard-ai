import {DefaultGetIngestionQueryState, DefaultGetLatestMergedQueryState, DefaultUseOpenWorkspaceQueryState} from "../apiState/ApiStateTypes.ts"
import {BaseQueryFn, EndpointBuilder} from "@reduxjs/toolkit/query"
import {api} from "../api/Api.ts"

export const apiQueries = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
    query: () => ({ url: 'open-workspace', method: 'POST' }),
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      try {
        await queryFulfilled
      } catch {
        dispatch(api.endpoints.selectMap.initiate({ mapId: ''}))
      }
    },
    providesTags: ['Workspace']
  }),
  getLatestMerged: builder.query<DefaultGetLatestMergedQueryState, void>({
    query: () => ({ url: 'get-latest-merged', method: 'POST' }),
    providesTags: ['LatestMerged']
  }),
  getShares: builder.query<any, void>({
    query: () => ({ url: 'get-shares', method: 'POST' }),
    providesTags: ['Shares']
  }),
  getIngestion: builder.query<DefaultGetIngestionQueryState, void>({
    query: () => ({ url: '/get-ingestion', method: 'POST', body: {} }),
    providesTags: ['IngestionData']
  })
})
