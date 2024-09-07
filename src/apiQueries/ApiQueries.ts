import {DefaultGetIngestionQueryState, DefaultUseOpenWorkspaceQueryState} from "../apiState/ApiStateTypes.ts"
import {api} from "../api/Api.ts"
import {BaseQueryFn, EndpointBuilder} from "@reduxjs/toolkit/query"

export const apiQueries = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
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
  getShares: builder.query<any, void>({
    query: () => ({ url: 'get-shares', method: 'POST' }),
    providesTags: ['Shares']
  }),
  getIngestion: builder.query<DefaultGetIngestionQueryState, void>({
    query: () => ({ url: '/get-ingestion', method: 'POST', body: {} }),
    providesTags: ['IngestionData']
  })
})
