import { User, Map } from '../../server/generated/prisma/';

export enum ColorMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export type UserInfo = Pick<User, 'name' | 'colorMode'>

export type MapInfo = Pick<Map, 'id' | 'name'> & { mapData: object | any }

export type TabMapInfo = Pick<Map, 'id' | 'name'> []

export interface ShareInfo {
  SharesByMe: {
    id: number
    access: string
    status: string
    Map: {
      name: string
    }
    ShareUser: {
      email: string
    }
  }[];
  SharesWithMe: {
    id: number
    access: string
    status: string
    Map: {
      name: string
    }
    OwnerUser: {
      email: string
    }
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

export type RenameMapRequestDto = Pick<Map, 'id' | 'name'>

export type RenameMapResponseDto = {
  mapInfo: Pick<Map, 'name'>
}
