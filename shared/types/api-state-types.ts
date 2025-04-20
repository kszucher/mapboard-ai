export enum ColorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export interface UserInfo {
  userName: string;
  colorMode: ColorMode;
  tabMapIdList: number[];
  tabMapNameList: string[];
}

export interface MapInfo {
  mapId: number;
  mapName: string;
  mapData: object;
}

export interface ShareInfo {
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

export type SignInResponseDto = {
  workspaceId: number;
  mapInfo: MapInfo,
  userInfo: UserInfo,
  shareInfo: ShareInfo,
}
