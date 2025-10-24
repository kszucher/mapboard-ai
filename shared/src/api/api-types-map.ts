import { Map, ShareAccess } from '../schema/schema';

export type GetMapInfoQueryResponseDto = {
  id: number,
  name: string,
  data: Map,
  shareAccess: ShareAccess
};

export type CreateMapInTabRequestDto = {
  mapName: string
}

export type CreateMapInTabDuplicateRequestDto = {
  mapId: number
}

export type RenameMapRequestDto = {
  mapId: number
  mapName: string
}

export type DeleteMapRequestDto = {
  mapId: number
}

export type InsertNodeRequestDto = {
  mapId: number
  nodeTypeId: number
}

export type InsertEdgeRequestDto = {
  mapId: number
  fromNodeId: number
  toNodeId: number
}

export type DeleteNodeRequestDto = {
  mapId: number
  nodeId: number
}

export type DeleteEdgeRequestDto = {
  mapId: number
  edgeId: number
}

export type MoveNodeRequestDto = {
  mapId: number
  nodeId: number
  offsetX: number
  offsetY: number
}

export type ExecuteMapRequestDto = {
  mapId: number
}
