export const ShareStatus = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
} as const;
export type ShareStatus = (typeof ShareStatus)[keyof typeof ShareStatus];

export const ShareAccess = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
} as const;

export type ShareAccess = (typeof ShareAccess)[keyof typeof ShareAccess];

export type GetShareInfoQueryResponseDto = {
  SharesByMe: {
    id: number
    mapId: number
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
    mapId: number
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

export type CreateShareRequestDto = {
  mapId: number
  shareEmail: string
  shareAccess: ShareAccess
}

export type AcceptShareRequestDto = {
  shareId: number
}

export type WithdrawShareRequestDto = {
  shareId: number
}

export type RejectShareRequestDto = {
  shareId: number
}

export type ModifyShareAccessRequestDto = {
  shareId: number
  shareAccess: ShareAccess
}

