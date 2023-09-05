import {getNSIC, getG, getNodeById, getNodeByPath, getNR, getPathDir, getRi, getRootEndX, getRootEndY, getRootMidX, getRootMidY, getRootStartX, getRootStartY, getSI1P, getX, isCON, isD, isXACC, isXACR, getXA, sortPath} from "../core/MapUtils"
import {adjust} from "../core/Utils"
import {TASK_CIRCLES_GAP, TASK_CIRCLES_NUM} from "../state/Consts";
import {LineTypes, Sides} from "../state/Enums"
import {Connection, G, M, N} from "../state/MapStateTypes"

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

export const getLinePathBetweenNodes = (na: N, nb: N) => {
  const dir = getPathDir(nb.path)
  const { lineType } = nb
  const sx = (dir === -1 ? na.nodeStartX : na.nodeEndX)
  const sy = (na.nodeY)
  const ex = (dir === -1 ? nb.nodeEndX : nb.nodeStartX)
  const ey = (nb.nodeY)
  const dx = (dir === -1 ? (na.nodeStartX - nb.nodeEndX) : (nb.nodeStartX - na.nodeEndX))
  const dy = (nb.nodeY - na.nodeY)
  let path
  if (lineType === LineTypes.bezier) {
    const c1x = (sx + dir * dx / 4)
    const c1y = (sy)
    const c2x = (sx + dir * dx / 4)
    const c2y = (sy + dy)
    path = getBezierLinePath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
  } else if (lineType === LineTypes.edge) {
    const m1x = (sx + dir * dx / 2)
    const m1y = (sy)
    const m2x = (sx + dir * dx / 2)
    const m2y = (sy + dy)
    path = getEdgeLinePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
  }
  return path
}

export const getLinePathBetweenRoots = (m: M, connection: Connection) => {
  const { fromNodeId, fromNodeSide, toNodeId, toNodeSide } = connection
  const fromNode = getNodeById(m, fromNodeId)
  const toNode = getNodeById(m, toNodeId)
  let sx = 0, sy = 0, c1x = 0, c1y = 0
  switch (fromNodeSide) {
    case Sides.R: sx = getRootEndX(m, fromNode); sy = getRootMidY(m, fromNode); c1x = sx + 100; c1y = sy; break
    case Sides.L: sx = getRootStartX(m, fromNode); sy = getRootMidY(m, fromNode); c1x = sx - 100; c1y = sy; break
    case Sides.T: sx = getRootMidX(m, fromNode); sy = getRootStartY(m, fromNode); c1x = sx; c1y = sy - 100; break
    case Sides.B: sx = getRootMidX(m, fromNode); sy = getRootEndY(m, fromNode); c1x = sx; c1y = sy + 100; break
  }
  let ex = 0, ey = 0, c2x = 0, c2y = 0
  switch (toNodeSide) {
    case Sides.R: ex = getRootEndX(m, toNode); ey = getRootMidY(m, toNode); c2x = ex + 100; c2y = ey; break
    case Sides.L: ex = getRootStartX(m, toNode); ey = getRootMidY(m, toNode); c2x = ex - 100; c2y = ey; break
    case Sides.T: ex = getRootMidX(m, toNode); ey = getRootStartY(m, toNode); c2x = ex; c2y = ey - 100; break
    case Sides.B: ex = getRootMidX(m, toNode); ey = getRootEndY(m, toNode); c2x = ex; c2y = ey + 100;  break
  }
  return getBezierLinePath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
}

export const getPolygonS = (m: M, n: N, selection: string): PolygonPoints => {
  const R = 8
  const g = getG(m)
  const ri = getRi(n.path)
  const rx = getNodeByPath(m, ['r', ri]) as N
  const dir = getPathDir(n.path)
  const xi = dir === -1 ? n.nodeEndX : n.nodeStartX
  const xo = dir === -1 ? n.nodeStartX : n.nodeEndX
  const selfH = isD(n.path) ? rx.selfH : n.selfH
  const yu = n.nodeY - selfH / 2
  const yd = n.nodeY + selfH / 2
  const myu = n.nodeY - n.maxH / 2
  const myd = n.nodeY + n.maxH / 2
  const w = isD(n.path) ? rx.selfW + n.familyW : n.maxW
  return selection === 's' ? {
    ax: n.nodeStartX,
    bx: xo - dir * R,
    cx: n.nodeEndX,
    ayu: yu,
    ayd: yd,
    byu: yu,
    byd: yd,
    cyu: yu,
    cyd: yd
  } : {
    ax: xi + (dir === -1 ? -w : 0),
    bx: xo + dir * g.sLineDeltaXDefault,
    cx: xi + (dir === 1 ? w : 0),
    ayu: dir === -1 ? myu : yu,
    ayd: dir === -1 ? myd : yd,
    byu: myu,
    byd: myd,
    cyu: dir === -1 ? yu : myu,
    cyd: dir === -1 ? yd : myd
  }
}

export const getPolygonC = (m: M): PolygonPoints => {
  const ni = getNodeByPath(m, getSI1P(getX(m).path)) as N
  const n = getNodeByPath(m, getX(m).path)
  let y, h, ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd
  if (isXACR(m)) {
    const i = getX(m).path.at(-2) as number
    y = - ni.maxRowHeight[i] / 2 + n.nodeY
    h = ni.maxRowHeight[i]
    ax = getXA(m).slice().sort(sortPath).at(0)!.nodeStartX
    bx = cx = getXA(m).slice().sort(sortPath).at(-1)!.nodeEndX
    ayu = byu = cyu = y
    ayd = byd = cyd = y + h
  } else if (isXACC(m)) {
    y = ni.nodeY - ni.selfH / 2
    h = ni.selfH
    ax = getXA(m).at(0)!.nodeStartX
    bx = cx = getXA(m).at(0)!.nodeEndX
    ayu = byu = cyu = y
    ayd = byd = cyd = y + h
  } else {
    const i = getX(m).path.at(-2) as number
    y = - ni.maxRowHeight[i] / 2 + n.nodeY
    h = ni.maxRowHeight[i]
    ax = getX(m).nodeStartX
    bx = cx =getX(m).nodeEndX
    ayu = byu = cyu = y
    ayd = byd = cyd = y + h
  }
  return {ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd}
}

export const getPolygonPath = (n: N, polygonPoints: PolygonPoints, selection: string, margin: number) => {
  const dir = getPathDir(n.path)
  let { ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd } = polygonPoints
  ax = adjust(ax - margin)
  bx = adjust(bx - dir * margin)
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
    if (selection === 's' && i === (dir === - 1 ? 4 : 1)) {
      path += getBezierLinePath('L', [sx, sy, sx, sy, sx, sy, ex - dir * 24, ey])
    } else if (selection === 's' && i === (dir === - 1 ? 1 : 4)) {
      path += getBezierLinePath('L', [sx - dir * 24, sy, ex, ey, ex, ey, ex, ey])
    } else {
      path += getBezierLinePath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    }
  }
  return path + 'z'
}

export const getArcPath = (n: N, margin: number, closed: boolean) => {
  const R = 8
  const dir = getPathDir(n.path)
  const xi = dir === -1 ? n.nodeEndX : n.nodeStartX
  const yu = n.nodeY - n.selfH / 2
  let x1 = adjust(xi - margin * dir)
  let y1 = adjust(yu + R - margin)
  let dx = n.selfW - 2 * R + 2 * margin
  let dy = n.selfH - 2 * R + 2 * margin
  return dir === -1
    ? `M${x1},${y1}
      a${+R},${+R} 0 0 0 ${-R},${-R} h${-dx} 
      a${+R},${+R} 0 0 0 ${-R},${+R} v${+dy} 
      a${+R},${+R} 0 0 0 ${+R},${+R} h${+dx} 
      a${+R},${+R} 0 0 0 ${+R},${-R}
      ${closed ? 'Z' : ''}`
    : `M${x1},${y1} 
      a${+R},${+R} 0 0 1 ${+R},${-R} h${+dx}
      a${+R},${+R} 0 0 1 ${+R},${+R} v${+dy}
      a${+R},${+R} 0 0 1 ${-R},${+R} h${-dx}
      a${+R},${+R} 0 0 1 ${-R},${-R}
      ${closed ? 'Z' : ''}`
}

export const getGridPath = (n: N) => {
  const dir = getPathDir(n.path)
  const xi = dir === -1 ? n.nodeEndX : n.nodeStartX
  const yu = n.nodeY - n.selfH / 2
  const yd = n.nodeY + n.selfH / 2
  let path = ''
  for (let i = 1; i < n.sumMaxRowHeight.length - 1; i++) {
    const x1 = adjust(n.nodeStartX)
    const x2 = adjust(n.nodeEndX)
    const y = adjust(yu + n.sumMaxRowHeight[i])
    path += `M${x1},${y} L${x2},${y}`
  }
  for (let j = 1; j < n.sumMaxColWidth.length - 1; j++) {
    const x = adjust(xi + dir*n.sumMaxColWidth[j])
    path += `M${x},${yu} L${x},${yd}`
  }
  return path
}

export const getTaskWidth = (g: G) => TASK_CIRCLES_NUM * (g.density === 'large' ? 24 : 20) + (TASK_CIRCLES_NUM - 1) * TASK_CIRCLES_GAP + 40

export const getTaskRadius = (g: G) => g.density === 'large' ? 24 : 20

export const getTaskStartPoint = (m: M, g: G, n: N) => {
  switch (true) {
    case getPathDir(n.path) === 1 && !isCON(n.path): return getRootEndX(m, getNR(m, n)) - getTaskWidth(g)
    case getPathDir(n.path) === -1 && !isCON(n.path): return getTaskWidth(g)
    case getPathDir(n.path) === 1 && isCON(n.path): return getNSIC(m, n).nodeEndX - 120
    case getPathDir(n.path) === -1 && isCON(n.path): return getNSIC(m, n).nodeStartX + 120
    default: return 0
  }
}

export const getRootSideX = (m: M, n: N, side: string) => {
  switch (true) {
    case (side === 'L'): return getRootStartX(m, n)
    case (side === 'R'): return getRootEndX(m, n) - 24
    case (side === 'T'): return getRootMidX(m, n) - 12
    case (side === 'B'): return getRootMidX(m, n) - 12
    default: return 0
  }
}

export const getRootSideY = (m: M, n: N, side: string) => {
  switch (true) {
    case (side === 'L'): return getRootMidY(m, n) - 12
    case (side === 'R'): return getRootMidY(m, n) - 12
    case (side === 'T'): return getRootStartY(m, n)
    case (side === 'B'): return getRootEndY(m, n) - 24
    default: return 0
  }
}

// export const calculateMiddlePoint = (sx, sy, c1x, c1y, c2x, c2y, ex, ey) => {
//   // Calculate the middle point t value
//   var t = 0.5;
//
//   // Calculate intermediate points based on the t value
//   var p0x = sx + (c1x - sx) * t;
//   var p0y = sy + (c1y - sy) * t;
//   var p1x = c1x + (c2x - c1x) * t;
//   var p1y = c1y + (c2y - c1y) * t;
//   var p2x = c2x + (ex - c2x) * t;
//   var p2y = c2y + (ey - c2y) * t;
//
//   // Calculate final point based on intermediate points
//   var p3x = p0x + (p1x - p0x) * t;
//   var p3y = p0y + (p1y) * t;
//
//   var p4x = p1x + (p2x - p1x) * t;
//   var p4y = p1y + (p2y - p1y) * t;
//
//   var px = p3x + (p4x - p3x) * t;
//   var py = p3y + (p4y - p3y) * t;
//
//   return {
//     x: px,
//     y: py
//   };
// }
