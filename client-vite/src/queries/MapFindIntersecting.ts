import {M} from "../state/MapStateTypes"
import {isS, mT} from "./MapQueries.ts"

export const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return (
    maxAx >= minBx &&
    minAx <= maxBx &&
    minAy <= maxBy &&
    maxAy >= minBy
  )
}
export const mapFindIntersecting = (m: M, fromX: number, fromY: number, toX: number, toY: number ) => (
  mT(m).filter(ti =>
    isS(ti.path) && ti.co1.length === 0 && ti.content !== '' &&
    +rectanglesIntersect([
      Math.min(fromX, toX),
      Math.min(fromY, toY),
      Math.max(fromX, toX),
      Math.max(fromY, toY),
      ti.nodeStartX,
      ti.nodeStartY,
      ti.nodeStartX + ti.selfW,
      ti.nodeStartY + ti.selfH
    ])
  )
)
