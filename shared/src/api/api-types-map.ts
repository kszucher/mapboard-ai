import { ControlType, M, N } from '../map/state/map-consts-and-types';

export type MapInfo = {
  id: number
  name: string
  data: M
}

export type GetMapInfoQueryResponseDto = {
  mapInfo: {
    id: number,
    name: string,
    data: M
  };
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

export type UpdateMapRequestDto = {
  mapId: number
  mapOp: MapOp
}

export type ExecuteMapFileUploadDto = {
  mapId: string
  nodeId: number
}

export type ExecuteMapRequestDto = {
  mapId: number
}

export type DeleteMapRequestDto = {
  mapId: number
}

export enum MapOpType {
  INSERT_NODE = 'INSERT_NODE',
  INSERT_LINK = 'INSERT_LINK',
  DELETE_NODE = 'DELETE_NODE',
  DELETE_LINK = 'DELETE_LINK',
  MOVE_NODE = 'MOVE_NODE',
  UPDATE_NODE = 'UPDATE_NODE',
}

export type MapOp =
  | { type: MapOpType.INSERT_NODE; payload: { controlType: ControlType } }
  | { type: MapOpType.INSERT_LINK; payload: { fromNodeId: number, toNodeId: number } }
  | { type: MapOpType.DELETE_NODE; payload: { nodeId: number } }
  | { type: MapOpType.DELETE_LINK; payload: { linkId: number } }
  | { type: MapOpType.MOVE_NODE; payload: { nodeId: number, offsetX: number, offsetY: number } }
  | { type: MapOpType.UPDATE_NODE; payload: { nodeId: number, data: Partial<N> } }
