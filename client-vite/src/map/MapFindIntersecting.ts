import {N} from "../state/NPropsTypes"

export const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
export const mapFindIntersecting = (ml: N[], fromCoords: { x: number, y: number }, toCoords: { x: number, y: number }) => (
  ml.filter(n =>
    n.type === 'struct' &&
    !n.hasCell &&
    n.content !== '' &&
    +rectanglesIntersect([
      Math.min(fromCoords.x, toCoords.x),
      Math.min(fromCoords.y, toCoords.y),
      Math.max(fromCoords.x, toCoords.x),
      Math.max(fromCoords.y, toCoords.y),
      n.nodeStartX,
      n.nodeY,
      n.nodeEndX,
      n.nodeY,
    ])
  )
)
