export const ColorMode = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

export const ShareAccess = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VIEW: 'VIEW',
  EDIT: 'EDIT',
} as const;

export type ShareAccess = (typeof ShareAccess)[keyof typeof ShareAccess];

export const ShareStatus = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
} as const;

export type ShareStatus = (typeof ShareStatus)[keyof typeof ShareStatus];

export type UserInfo = {
  name: string
  colorMode: ColorMode
}

export type MapInfo = {
  id: number
  name: string
  data: object | any
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

export type CreateMapInTabRequestDto = {
  mapName: string
}

export type CreateMapInTabResponseDto = {
  mapInfo: MapInfo
  tabMapInfo: TabMapInfo
}

export type CreateMapInTabDuplicateRequestDto = {
  mapId: number
}

export type CreateMapInTabDuplicateResponseDto = {
  mapInfo: MapInfo
  tabMapInfo: TabMapInfo
}

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type RenameMapResponseDto = {
  mapInfo: Pick<MapInfo, 'name'>
}

export type DeleteMapRequestDto = {}

export type DeleteMapResponseDto = {}

export type CreateShareRequestDto = {
  mapId: number,
  shareEmail: string,
  shareAccess: ShareAccess
}

export type CreateShareResponseDto = void

export type UpdateShareAccessRequestDto = {
  shareId: number
}

export type UpdateShareAccessResponseDto = void

export type UpdateShareStatusAcceptedRequestDto = {
  shareId: number
}

export type UpdateShareStatusAcceptedResponseDto = void

export type WithdrawShareRequestDto = {
  shareId: number
}

export type WithdrawShareResponseDto = void

export type RejectShareRequestDto = {
  shareId: number
}

export type RejectShareResponseDto = void

export type CreateWorkspaceRequestDto = void

export type CreateWorkspaceResponseDto = {
  workspaceId: number
  userInfo: UserInfo
  mapInfo: MapInfo
  tabMapInfo: TabMapInfo
  shareInfo: ShareInfo
}

export type UpdateWorkspaceMapRequestDto = {
  mapId: number
}

export type UpdateWorkspaceMapResponseDto = {
  mapInfo: MapInfo
}
