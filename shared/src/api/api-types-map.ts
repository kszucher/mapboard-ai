export type MapInfo = {
  id: number
  name: string
  data: object | any
}

export type GetMapInfoQueryResponseDto = {
  mapInfo: {
    id: number,
    name: string,
    data: object | any
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

export type DeleteMapRequestDto = {
  mapId: number
}

export type DeleteMapResponseDto = void
