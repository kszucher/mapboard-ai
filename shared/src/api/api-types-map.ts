import { M, ShareAccess } from '../schema/schema';

export type GetMapInfoQueryResponseDto = {
  id: number,
  name: string,
  data: M,
  shareAccess: ShareAccess
};

export type CreateMapInTabRequestDto = {
  mapName: string
}

export type CreateMapInTabDuplicateRequestDto = {
  mapId: number
}

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type ExecuteMapRequestDto = {
  mapId: number
}

export type DeleteMapRequestDto = {
  mapId: number
}

