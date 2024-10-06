import {Side} from "../consts/Enums.ts"
import {idToR} from "../mapQueries/MapQueries.ts"
import {L, M, R} from "../mapState/MapStateTypes.ts"
import {adjust} from "../utils/Utils.ts"

type coordinates = [number, number]

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
  }
}

const getCoordsInLine = (a: coordinates, b: coordinates, dt: number) => {
  const [x0, y0] = a
  const [x1, y1] = b
  const d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  const t = dt / d
  const xt = (1 - t) * x0 + t * x1
  const yt = (1 - t) * y0 + t * y1
  return [xt, yt]
}

export const getCoordsMidBezier = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5
  const mt = 1 - t
  const x = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex
  const y = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey
  return {x, y}
}

export const getLinearLinePath = ({x1, x2, y1, y2} : {x1: number, x2: number, y1: number, y2: number}) => `M${x1},${y1} L${x2},${y2}`

export const getBezierLinePath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) => `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`

const getCoordinatesForSide = (node: R, side: Side) : {x: number, y: number, cx: number, cy: number} => {
  const { nodeStartX, nodeStartY, selfW, selfH } = node
  const offset = 100
  switch (side) {
    case Side.R: return { x: nodeStartX + selfW, y: nodeStartY + selfH / 2, cx: nodeStartX + selfW + offset, cy: nodeStartY + selfH / 2 }
    case Side.L: return { x: nodeStartX, y: nodeStartY + selfH / 2, cx: nodeStartX - offset, cy: nodeStartY + selfH / 2 }
    case Side.T: return { x: nodeStartX + selfW / 2, y: nodeStartY, cx: nodeStartX + selfW / 2, cy: nodeStartY - offset }
    case Side.B: return { x: nodeStartX + selfW / 2, y: nodeStartY + selfH, cx: nodeStartX + selfW / 2, cy: nodeStartY + selfH + offset }
  }
}

export const getRootLinePath = (m: M, l: L) => {
  const { fromNodeId, fromNodeSide, toNodeId, toNodeSide } = l
  const fromNode = idToR(m, fromNodeId)
  const toNode = idToR(m, toNodeId)
  const { x: sx, y: sy, cx: c1x, cy: c1y } = getCoordinatesForSide(fromNode, fromNodeSide)
  const { x: ex, y: ey, cx: c2x, cy: c2y } = getCoordinatesForSide(toNode, toNodeSide)
  return [sx, sy, c1x, c1y, c2x, c2y, ex, ey]
}

export const getPolygonPath = (t: R, mode: string, margin: number) => {
  let ax = 0, bx = 0, cx = 0, ayu = 0, ayd = 0, byu = 0, byd = 0, cyu = 0, cyd = 0
  switch (mode) {
    case 'sSelf': {
      const R = 8
      ax = t.nodeStartX
      bx = t.nodeStartX + t.selfW - R
      cx = t.nodeStartX + t.selfW
      ayu = byu = cyu = t.nodeStartY
      ayd = byd = cyd = t.nodeStartY + t.selfH
      break
    }
  }
  ax = adjust(ax - margin)
  bx = adjust(bx - margin)
  cx = adjust(cx + margin)
  ayu = adjust(ayu - margin)
  ayd = adjust(ayd + margin)
  byu = adjust(byu - margin)
  byd = adjust(byd + margin)
  cyu = adjust(cyu - margin)
  cyd = adjust(cyd + margin)
  const points = [[ax, ayu], [bx, byu], [cx, cyu], [cx, cyd], [bx, byd], [ax, ayd]] as coordinates[]
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
    const currPoint = points[i]
    const nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
    const [sx, sy] = getCoordsInLine(currPoint, prevPoint, 12)
    const [c1x, c1y] = currPoint
    const [c2x, c2y] = currPoint
    const [ex, ey] = getCoordsInLine(currPoint, nextPoint, 12)
    if (['sSelf', 'c'].includes(mode) && i === 1) {
      path += getBezierLinePath('L', [sx, sy, sx, sy, sx, sy, ex - 24, ey])
    } else if (['sSelf', 'c'].includes(mode) && i === 4) {
      path += getBezierLinePath('L', [sx - 24, sy, ex, ey, ex, ey, ex, ey])
    } else {
      path += getBezierLinePath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    }
  }
  return path + 'z'
}
