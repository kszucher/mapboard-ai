import { User, Map } from '../../server/generated/prisma/';

export enum ColorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export type UserInfo = Pick<User, 'name' | 'colorMode'>

export type MapInfo = Pick<Map, 'id' | 'name'> & { mapData: object | any }

export type TabMapInfo = Pick<Map, 'id' | 'name'> []

export interface ShareInfo {
  sharesWithUser: {
    id: number
    sharedMapName: string
    ownerUserEmail: string
    access: string
    status: string
  }[];
  sharesByUser: {
    id: number
    sharedMapName: string
    shareUserEmail: string
    access: string
    status: string
  }[];
}

export type SignInResponseDto = {
  workspaceId: number
  userInfo: UserInfo
  mapInfo: MapInfo
  tabMapInfo: TabMapInfo
  shareInfo: ShareInfo
}

export type CreateMapInTabRequestDto = {
  mapName: string
}

export type CreateMapInTabResponseDto = {
  mapInfo: MapInfo
  tabMapInfo: TabMapInfo
}

export type WorkspaceUpdateResponseDto = {
  mapInfo: MapInfo
}

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type RenameMapResponseDto = {
  mapInfo: Pick<Map, 'name'>
}
