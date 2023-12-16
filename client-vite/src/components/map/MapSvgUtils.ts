import {getG, getNodeById, getTR, getX, isXACC, isXACR, getXA, sortPath} from "../../selectors/MapSelector"
import {adjust} from "../../utils/Utils"
import {TASK_CIRCLES_GAP, TASK_CIRCLES_NUM} from "../../state/Consts"
import {LineTypes, Sides} from "../../state/Enums"
import {G, L, M, T} from "../../state/MapStateTypes"

type PolygonPoints = Record<'ax' | 'bx' | 'cx' | 'ayu' | 'ayd' | 'byu' | 'byd' | 'cyu' | 'cyd', number>

const getCoordsInLine = (a: any[], b: any[], dt: number) => {
  const [x0, y0] = a
  const [x1, y1] = b
  const d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  const t = dt / d
  const xt = (1 - t) * x0 + t * x1
  const yt = (1 - t) * y0 + t * y1
  return [xt, yt]
}

export const getLinearLinePath = ({x1, x2, y} : {x1: number, x2: number, y: number}) => `M${x1},${y} L${x2},${y}`
export const getEdgeLinePath = (c: string, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]: number[]) => `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
export const getBezierLinePath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) => `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`

export const getBezierLinePoints = ([ax, ay, bx, by]: number[]): number[] => {
  const dx = (bx - ax)
  const dy = (by - ay)
  return [ax, ay, ax + dx / 4, ay, ax + dx / 4, ay + dy, bx, by]
}

export const getLinePathBetweenNodes = (na: T, nb: T) => {
  const { lineType } = nb
  const sx = na.nodeEndX
  const sy = na.nodeStartY + na.selfH / 2
  const ex = nb.nodeStartX
  const ey = nb.nodeStartY + nb.selfH / 2
  const dx = nb.nodeStartX - na.nodeEndX
  const dy = nb.nodeStartY + nb.selfH / 2 - na.nodeStartY - na.selfH / 2
  let path
  if (lineType === LineTypes.bezier) {
    const c1x = (sx + dx / 4)
    const c1y = (sy)
    const c2x = (sx + dx / 4)
    const c2y = (sy + dy)
    path = getBezierLinePath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
  } else if (lineType === LineTypes.edge) {
    const m1x = (sx + dx / 2)
    const m1y = (sy)
    const m2x = (sx + dx / 2)
    const m2y = (sy + dy)
    path = getEdgeLinePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
  }
  return path
}

export const getLinePathBetweenRoots = (m: M, l: L) => {
  const { fromNodeId, fromNodeSide, toNodeId, toNodeSide } = l
  const fromNode = getNodeById(m, fromNodeId)
  const toNode = getNodeById(m, toNodeId)
  let sx = 0, sy = 0, c1x = 0, c1y = 0
  switch (fromNodeSide) {
    case Sides.R: sx = fromNode.nodeEndX; sy = fromNode.nodeStartY + fromNode.selfH / 2; c1x = sx + 100; c1y = sy; break
    case Sides.L: sx = fromNode.nodeStartX; sy = fromNode.nodeStartY + fromNode.selfH / 2; c1x = sx - 100; c1y = sy; break
    case Sides.T: sx = fromNode.nodeStartX + fromNode.selfW / 2; sy = fromNode.nodeStartY; c1x = sx; c1y = sy - 100; break
    case Sides.B: sx = fromNode.nodeStartX + fromNode.selfW / 2; sy = fromNode.nodeEndY; c1x = sx; c1y = sy + 100; break
  }
  let ex = 0, ey = 0, c2x = 0, c2y = 0
  switch (toNodeSide) {
    case Sides.R: ex = toNode.nodeEndY; ey = toNode.nodeStartY + toNode.selfH / 2; c2x = ex + 100; c2y = ey; break
    case Sides.L: ex = toNode.nodeStartX; ey = toNode.nodeStartY + toNode.selfH / 2; c2x = ex - 100; c2y = ey; break
    case Sides.T: ex = toNode.nodeStartX + toNode.selfW / 2; ey = toNode.nodeStartY; c2x = ex; c2y = ey - 100; break
    case Sides.B: ex = toNode.nodeStartX + toNode.selfW / 2; ey = toNode.nodeEndY; c2x = ex; c2y = ey + 100;  break
  }
  return [sx, sy, c1x, c1y, c2x, c2y, ex, ey]
}

export const getPolygonS = (m: M, t: T, selection: string): PolygonPoints => {
  const R = 8
  const g = getG(m)
  let ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd
  if (selection === 's') {
    ax = t.nodeStartX
    bx = t.nodeEndX - R
    cx = t.nodeEndX
    ayu = byu = cyu = t.nodeStartY
    ayd = byd = cyd = t.nodeEndY
  } else {
    ax = t.nodeStartX
    bx = t.nodeEndX + g.sLineDeltaXDefault
    cx = t.nodeStartX + t.maxW
    ayu = t.nodeStartY
    ayd = t.nodeEndY
    byu = t.nodeStartY + t.selfH / 2 - t.maxH / 2
    byd = t.nodeStartY + t.selfH / 2 + t.maxH / 2
    cyu = t.nodeStartY + t.selfH / 2 - t.maxH / 2
    cyd = t.nodeStartY + t.selfH / 2 + t.maxH / 2
  }
  return {ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd}
}

export const getPolygonC = (m: M): PolygonPoints => {
  let ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd
  if (isXACR(m)) {
    ax = getXA(m).slice().sort(sortPath).at(0)!.nodeStartX
    bx = cx = getXA(m).slice().sort(sortPath).at(-1)!.nodeEndX
    ayu = byu = cyu = getXA(m).slice().sort(sortPath).at(0)!.nodeStartY
    ayd = byd = cyd = getXA(m).slice().sort(sortPath).at(0)!.nodeEndY
  } else if (isXACC(m)) {
    ax = getXA(m).at(0)!.nodeStartX
    bx = cx = getXA(m).at(0)!.nodeEndX
    ayu = byu = cyu = getXA(m).slice().sort(sortPath).at(0)!.nodeStartY
    ayd = byd = cyd = getXA(m).slice().sort(sortPath).at(-1)!.nodeEndY
  } else {
    ax = getX(m).nodeStartX
    bx = cx = getX(m).nodeEndX
    ayu = byu = cyu = getX(m).nodeStartY
    ayd = byd = cyd = getX(m).nodeEndY
  }
  return {ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd}
}

export const getPolygonPath = (_: T, polygonPoints: PolygonPoints, selection: string, margin: number) => {
  let { ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd } = polygonPoints
  ax = adjust(ax - margin)
  bx = adjust(bx - margin)
  cx = adjust(cx + margin)
  ayu = adjust(ayu - margin)
  ayd = adjust(ayd + margin)
  byu = adjust(byu - margin)
  byd = adjust(byd + margin)
  cyu = adjust(cyu - margin)
  cyd = adjust(cyd + margin)
  const points = [[ax, ayu], [bx, byu], [cx, cyu], [cx, cyd], [bx, byd], [ax, ayd]]
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
    const currPoint = points[i]
    const nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
    const [sx, sy] = getCoordsInLine(currPoint, prevPoint, 12)
    const [c1x, c1y] = currPoint
    const [c2x, c2y] = currPoint
    const [ex, ey] = getCoordsInLine(currPoint, nextPoint, 12)
    if (selection === 's' && i === 1) {
      path += getBezierLinePath('L', [sx, sy, sx, sy, sx, sy, ex - 24, ey])
    } else if (selection === 's' && i === 4) {
      path += getBezierLinePath('L', [sx - 24, sy, ex, ey, ex, ey, ex, ey])
    } else {
      path += getBezierLinePath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    }
  }
  return path + 'z'
}

export const getArcPath = (t: T, margin: number, closed: boolean) => {
  const R = 8
  const xi = t.nodeStartX
  const yu = t.nodeStartY
  let x1 = adjust(xi - margin)
  let y1 = adjust(yu + R - margin)
  let dx = t.selfW - 2 * R + 2 * margin
  let dy = t.selfH - 2 * R + 2 * margin
  return (
    `M${x1},${y1} 
    a${+R},${+R} 0 0 1 ${+R},${-R} h${+dx}
    a${+R},${+R} 0 0 1 ${+R},${+R} v${+dy}
    a${+R},${+R} 0 0 1 ${-R},${+R} h${-dx}
    a${+R},${+R} 0 0 1 ${-R},${-R}
    ${closed ? 'Z' : ''}`
  )
}

export const getGridPath = (t: T) => {
  const xi = t.nodeStartX
  const yu = t.nodeStartY
  const yd = t.nodeEndY
  let path = ''
  for (let i = 1; i < t.sumMaxRowHeight.length - 1; i++) {
    const x1 = adjust(t.nodeStartX)
    const x2 = adjust(t.nodeEndX)
    const y = adjust(yu + t.sumMaxRowHeight[i])
    path += `M${x1},${y} L${x2},${y}`
  }
  for (let j = 1; j < t.sumMaxColWidth.length - 1; j++) {
    const x = adjust(xi + t.sumMaxColWidth[j])
    path += `M${x},${yu} L${x},${yd}`
  }
  return path
}

export const getTaskWidth = (g: G) => TASK_CIRCLES_NUM * (g.density === 'large' ? 24 : 20) + (TASK_CIRCLES_NUM - 1) * TASK_CIRCLES_GAP + 40

export const getTaskRadius = (g: G) => g.density === 'large' ? 24 : 20

export const getTaskStartPoint = (m: M, g: G, t: T) => getTR(m, t).nodeEndX - getTaskWidth(g)

export const calculateMiddlePoint = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5 // t = 0.5 for calculating the middle point
  const mt = 1 - t
  const bx = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex
  const by = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey
  return {
    x: bx,
    y: by
  }
}
