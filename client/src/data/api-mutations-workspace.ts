import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateWorkspaceRequestDto,
  CreateWorkspaceResponseDto,
  UpdateWorkspaceRequestDto,
  UpdateWorkspaceResponseDto,
} from '../../../shared/src/api/api-types.ts';

export const apiMutationsWorkspace = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  createWorkspace: builder.mutation<CreateWorkspaceResponseDto, CreateWorkspaceRequestDto>({
    query: () => ({
      url: '/create-workspace',
      method: 'POST',
    }),
  }),

  updateWorkspace: builder.mutation<UpdateWorkspaceResponseDto, UpdateWorkspaceRequestDto>({
    query: ({ mapId }) => ({
      url: 'update-workspace-map',
      method: 'POST',
      body: { mapId },
    }),
  }),

  deleteWorkspace: builder.mutation<void, void>({
    query: () => ({
      url: '/delete-workspace',
      method: 'POST',
    }),
  }),
});
