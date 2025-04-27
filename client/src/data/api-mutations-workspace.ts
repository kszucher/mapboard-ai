import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import {
  CreateWorkspaceRequestDto,
  CreateWorkspaceResponseDto,
  UpdateWorkspaceMapRequestDto,
  UpdateWorkspaceMapResponseDto,
} from '../../../shared/src/api/api-types.ts';

export const apiMutationsWorkspace = (builder: EndpointBuilder<BaseQueryFn, string, string>) => ({
  createWorkspace: builder.mutation<CreateWorkspaceResponseDto, CreateWorkspaceRequestDto>({
    query: () => ({
      url: '/create-workspace',
      method: 'POST',
    }),
  }),

  updateWorkspaceMap: builder.mutation<UpdateWorkspaceMapResponseDto, UpdateWorkspaceMapRequestDto>({
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
