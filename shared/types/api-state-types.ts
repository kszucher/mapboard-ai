export enum ColorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export interface UserInfoDefaultState {
  userName: string;
  colorMode: ColorMode;
  tabMapIdList: number[];
  tabMapNameList: string[];
}

export interface MapInfoDefaultState {
  mapId: number;
  mapName: string;
  mapData: object;
}

export interface SharesInfoDefaultState {
  sharesWithUser: {
    id: number;
    sharedMapName: string;
    ownerUserEmail: string;
    access: string;
    status: string;
  }[];
  sharesByUser: {
    id: number;
    sharedMapName: string;
    shareUserEmail: string;
    access: string;
    status: string;
  }[];
}

export interface ExtractionRawPromptDefaultState {
  rawPrompt: string;
}
