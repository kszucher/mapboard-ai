export enum ColorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export interface UserInfo {
  userName: string;
  colorMode: ColorMode;
}

export interface MapInfo {
  id: number;
  name: string;
  mapData: object;
}

export interface TabInfo {
  tabMapIdList: number[];
  tabMapNameList: string[];
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
  userInfo: UserInfo,
  mapInfo: MapInfo,
  tabInfo: TabInfo,
  shareInfo: ShareInfo,
}

export type CreateMapInTabResponseDto = {
  mapInfo: MapInfo,
  tabInfo: TabInfo,
}

export type WorkspaceUpdateResponseDto = {
  mapInfo: MapInfo,
}

export type RenameMapResponseDto = {
  mapInfo: Pick<MapInfo, 'name'>
}
