export type TabMapInfo = {
  id: number
  name: string
} []

export type GetTabInfoQueryResponseDto = {
  tabInfo: TabMapInfo;
};

export type MoveUpMapInTabRequestDto = {
  mapId: number;
};

export type MoveDownMapInTabRequestDto = {
  mapId: number;
};
