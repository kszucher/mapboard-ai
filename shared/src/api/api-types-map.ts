import { E } from './api-types-map-edge';
import { N, NodeUpdateUp } from './api-types-map-node';
import { ShareAccess } from './api-types-share';

export type M = { e: E[], n: N[] };

export type GetMapInfoQueryResponseDto = {
  id: number,
  name: string,
  data: M,
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
  mapNodeConfigId: number
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

export type UpdateNodeRequestDto = {
  mapId: number
  nodeId: number
  node: NodeUpdateUp
}

export type ExecuteMapFileUploadDto = {
  mapId: number
  nodeId: number
}

export type ExecuteMapRequestDto = {
  mapId: number
}
