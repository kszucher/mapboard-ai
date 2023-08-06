import {M} from "../state/MapStateTypes"
import {getCountCO1, isS} from "./MapUtils"

export const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
export const mapFindIntersecting = (m: M, fromX: number, fromY: number, toX: number, toY: number ) => (
  m.filter(n =>
    isS(n.path) && !getCountCO1(m, n.path) && n.content !== '' &&
    +rectanglesIntersect([Math.min(fromX, toX), Math.min(fromY, toY), Math.max(fromX, toX), Math.max(fromY, toY), n.nodeStartX, n.nodeY, n.nodeEndX, n.nodeY])
  )
)
