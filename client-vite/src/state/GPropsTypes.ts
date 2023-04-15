import {P} from "./MTypes"

export interface GSaveAlways {
  path: P
  nodeId: string
}

export interface GSaveOptional {
  alignment: string
  density: string
  taskConfigN: number
  taskConfigGap: number
  margin: number
}

export interface GSaveNever {
  mapWidth: number
  mapHeight: number
  mapStartCenterX: number
  sLineDeltaXDefault: number
  padding: number
  defaultH: number
  taskConfigD: number
  taskConfigWidth: number
}

export type G = GSaveAlways & GSaveOptional & GSaveNever
export type GPartial = Required<GSaveAlways> & Partial<GSaveOptional> & Partial<GSaveNever>
