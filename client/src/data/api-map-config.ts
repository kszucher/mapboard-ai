import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapLinkConfigRequestDto,
  GetMapConfigInfoQueryResponseDto,
} from '../../../shared/src/api/api-types-map-config.ts';

export const apiMapConfig = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getMapConfigInfo: builder.query<GetMapConfigInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-map-config-info', method: 'POST', body: {} }),
    providesTags: ['MapConfigInfo'],
  }),

  createMapLinkConfig: builder.mutation<void, CreateMapLinkConfigRequestDto>({
    query: params => ({ url: 'create-map-link-config', method: 'POST', body: params }),
    invalidatesTags: ['MapConfigInfo'],
  }),
});
