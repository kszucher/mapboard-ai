import {M} from "../state/MapStateTypes"
import {mS} from "./MapQueries.ts"

export const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return (
    maxAx >= minBx &&
    minAx <= maxBx &&
    minAy <= maxBy &&
    maxAy >= minBy
  )
}
export const mapFindIntersecting = (m: M, fromX: number, fromY: number, toX: number, toY: number ): string[] => (
  mS(m).filter(si =>
    si.co1.length === 0 && si.content !== '' &&
    +rectanglesIntersect([
      Math.min(fromX, toX),
      Math.min(fromY, toY),
      Math.max(fromX, toX),
      Math.max(fromY, toY),
      si.nodeStartX,
      si.nodeStartY,
      si.nodeStartX + si.selfW,
      si.nodeStartY + si.selfH
    ])
  ).map(si => si.nodeId)
)
