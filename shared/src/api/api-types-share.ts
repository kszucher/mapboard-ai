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

export type CreateShareRequestDto = {
  mapId: number,
  shareEmail: string,
  shareAccess: ShareAccess
}

export type GetShareInfoQueryResponseDto = {
  shareInfo: ShareInfo;
};

export type CreateShareResponseDto = void

export type UpdateShareAccessRequestDto = {
  shareId: number
  shareAccess: ShareAccess
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
