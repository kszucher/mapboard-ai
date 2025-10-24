export type InsertNodeRequestDto = {
  mapId: number
  nodeTypeId: number
}

export type MoveNodeRequestDto = {
  mapId: number
  nodeId: number
  offsetX: number
  offsetY: number
}

export type DeleteNodeRequestDto = {
  mapId: number
  nodeId: number
}
