import {DefaultGetIngestionQueryState, DefaultGetLatestMergedQueryState, DefaultGetSharesQueryState, DefaultUseOpenWorkspaceQueryState} from "../apiState/ApiStateTypes.ts"
import {BaseQueryFn, EndpointBuilder} from "@reduxjs/toolkit/query"

export const apiQueries = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  openWorkspace: builder.query<DefaultUseOpenWorkspaceQueryState, void>({
    query: () => ({ url: 'open-workspace', method: 'POST' }),
    providesTags: ['Workspace']
  }),
  getLatestMerged: builder.query<DefaultGetLatestMergedQueryState, void>({
    query: () => ({ url: 'get-latest-merged', method: 'POST' }),
    providesTags: ['LatestMerged']
  }),
  getShares: builder.query<DefaultGetSharesQueryState, void>({
    query: () => ({ url: 'get-shares', method: 'POST' }),
    providesTags: ['Shares']
  }),
  getIngestion: builder.query<DefaultGetIngestionQueryState, void>({
    query: () => ({ url: '/get-ingestion', method: 'POST', body: {} }),
    providesTags: ['IngestionData']
  })
})
