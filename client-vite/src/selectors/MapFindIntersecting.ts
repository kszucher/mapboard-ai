import {M} from "../state/MapStateTypes"
import {getCountNCO1, isS, mT} from "./MapSelector"

export const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
export const mapFindIntersecting = (m: M, fromX: number, fromY: number, toX: number, toY: number ) => (
  mT(m).filter(t =>
    isS(t.path) && getCountNCO1(m, t) === 0 && t.content !== '' &&
    +rectanglesIntersect([Math.min(fromX, toX), Math.min(fromY, toY), Math.max(fromX, toX), Math.max(fromY, toY), t.nodeStartX, t.nodeY, t.nodeEndX, t.nodeY])
  )
)
