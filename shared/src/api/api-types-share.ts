import { Share, ShareAccess } from '../schema/schema';

export type GetShareInfoQueryResponseDto = {
  SharesByMe: Required<Pick<Share, 'id' | 'mapId' | 'access' | 'status' | 'Map' | 'ShareUser'>>[]
  SharesWithMe: Required<Pick<Share, 'id' | 'mapId' | 'access' | 'status' | 'Map' | 'OwnerUser'>>[]
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
