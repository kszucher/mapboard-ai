export const ColorMode = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

export type UserInfo = {
  name: string
  colorMode: ColorMode
}

export type MapInfo = {
  id: number
  name: string
  mapData: object | any
}

export type TabMapInfo = {
  id: number
  name: string
} []

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

export type CreateWorkspaceRequestDto = void

export type CreateWorkspaceResponseDto = {
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

export type WorkspaceUpdateRequestDto = {
  mapId: number
}

export type WorkspaceUpdateResponseDto = {
  mapInfo: MapInfo
}

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type RenameMapResponseDto = {
  mapInfo: Pick<MapInfo, 'name'>
}
