import { M } from '../map/state/map-consts-and-types';

export type MapInfo = {
  id: number
  name: string
  data: M
}

export type GetMapInfoQueryResponseDto = {
  mapInfo: {
    id: number,
    name: string,
    data: M
  };
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

export type ExecuteMapFileUploadDto = {
  mapId: string
  nodeId: string
}

export type ExecuteMapRequestDto = {
  mapId: number
}

export type DeleteMapRequestDto = {
  mapId: number
}
