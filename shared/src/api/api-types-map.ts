import { L } from './api-types-map-link';
import { ControlType, N } from './api-types-map-node';

export type M = { l: L[], n: N[] };

export type MapInfo = {
  id: number
  name: string
  data: M
}

export type GetMapInfoQueryResponseDto = {
  id: number,
  name: string,
  data: M
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
  controlType: ControlType
}

export type InsertLinkRequestDto = {
  mapId: number
  fromNodeId: number
  toNodeId: number
}

export type DeleteNodeRequestDto = {
  mapId: number
  nodeId: number
}

export type DeleteLinkRequestDto = {
  mapId: number
  linkId: number
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
  node: Partial<N>
}

export type ExecuteMapFileUploadDto = {
  mapId: number
  nodeId: number
}

export type ExecuteMapRequestDto = {
  mapId: number
}
