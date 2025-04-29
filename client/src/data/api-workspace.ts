import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateWorkspaceRequestDto,
  CreateWorkspaceResponseDto,
  UpdateWorkspaceMapRequestDto,
  UpdateWorkspaceMapResponseDto,
} from '../../../shared/src/api/api-types-workspace.ts';

export const apiWorkspace = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  createWorkspace: builder.mutation<CreateWorkspaceResponseDto, CreateWorkspaceRequestDto>({
    query: () => ({
      url: '/create-workspace',
      method: 'POST',
    }),
    invalidatesTags: ['UserInfo', 'MapInfo', 'TabInfo', 'ShareInfo'],
  }),

  updateWorkspaceMap: builder.mutation<UpdateWorkspaceMapResponseDto, UpdateWorkspaceMapRequestDto>({
    query: ({ mapId }) => ({
      url: 'update-workspace-map',
      method: 'POST',
      body: { mapId },
    }),
    invalidatesTags: ['MapInfo'],
  }),

  deleteWorkspace: builder.mutation<void, void>({
    query: () => ({
      url: '/delete-workspace',
      method: 'POST',
    }),
    invalidatesTags: [],
  }),
});
