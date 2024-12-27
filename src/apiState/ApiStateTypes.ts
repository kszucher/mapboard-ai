export interface UserInfoDefaultState {
  userName: string;
  colorMode: string;
  tabMapIdList: string[];
  tabMapNameList: string[];
}

export interface MapInfoDefaultState {
  mapId: string;
  mapName: string;
  mapData: object;
}

export interface SharesInfoDefaultState {
  sharesWithUser: {
    id: string;
    sharedMapName: string;
    ownerUserEmail: string;
    access: string;
    status: string;
  }[];
  sharesByUser: {
    id: string;
    sharedMapName: string;
    shareUserEmail: string;
    access: string;
    status: string;
  }[];
}
