import { ControlType, M } from '../map/state/map-consts-and-types';

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
  nodeId: string
}

export type ExecuteMapRequestDto = {
  mapId: number
}

export type DeleteMapRequestDto = {
  mapId: number
}

export enum MapOpType {
  INSERT_NODE,
  INSERT_LINK,
}

export type MapOp =
  | { type: MapOpType.INSERT_NODE; payload: { controlType: ControlType } }
  | { type: MapOpType.INSERT_LINK; payload: { fromNodeId: string, toNodeId: string } };
