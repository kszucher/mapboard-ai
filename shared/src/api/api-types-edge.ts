export type InsertEdgeRequestDto = {
  mapId: number
  fromNodeId: number
  toNodeId: number
}

export type DeleteEdgeRequestDto = {
  mapId: number
  edgeId: number
}
