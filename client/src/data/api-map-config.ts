import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateMapEdgeConfigRequestDto,
  GetMapConfigInfoQueryResponseDto,
} from '../../../shared/src/api/api-types-map-config.ts';

export const apiMapConfig = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  getMapConfigInfo: builder.query<GetMapConfigInfoQueryResponseDto, void>({
    query: () => ({ url: 'get-map-config-info', method: 'POST', body: {} }),
    providesTags: ['MapConfigInfo'],
  }),

  createMapEdgeConfig: builder.mutation<void, CreateMapEdgeConfigRequestDto>({
    query: params => ({ url: 'create-map-edge-config', method: 'POST', body: params }),
    invalidatesTags: ['MapConfigInfo'],
  }),
});
