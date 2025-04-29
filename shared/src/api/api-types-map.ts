export type MapInfo = {
  id: number
  name: string
  data: object | any
}

export type GetMapInfoQueryResponseDto = {
  mapInfo: MapInfo;
};

export type GetMapNameInfoQueryResponseDto = {
  mapInfo: {
    name: string
  };
};

export type CreateMapInTabRequestDto = {
  mapName: string
}

export type CreateMapInTabResponseDto = void

export type CreateMapInTabDuplicateRequestDto = {
  mapId: number
}

export type CreateMapInTabDuplicateResponseDto = void

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type RenameMapResponseDto = void

export type DeleteMapRequestDto = {}

export type DeleteMapResponseDto = {}
