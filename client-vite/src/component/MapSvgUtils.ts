import {getNSIC, getG, getNodeById, getNR, getPathDir, getRootEndX, getRootEndY, getRootMidX, getRootMidY, getRootStartX, getRootStartY, getX, isCON, isD, isXACC, isXACR, getXA, sortPath} from "../selectors/MapUtils"
import {adjust} from "../reducers/Utils"
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
  return [sx, sy, c1x, c1y, c2x, c2y, ex, ey]
}

export const getPolygonS = (m: M, n: N, selection: string): PolygonPoints => {
  const R = 8
  const g = getG(m)
  const dir = getPathDir(n.path)
  const selfH = (isD(n.path) ? getNR(m, n).selfH : n.selfH)
  const w = isD(n.path) ? getNR(m, n).selfW + n.familyW : n.maxW
  let ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd
  if (selection === 's') {
    ax = n.nodeStartX
    bx = dir === -1 ? n.nodeStartX + R: n.nodeEndX - R
    cx = n.nodeEndX
    ayu = byu = cyu = n.nodeY - selfH / 2
    ayd = byd = cyd = n.nodeY + selfH / 2
  } else {
    ax = dir === -1 ? n.nodeEndX - w : n.nodeStartX
    bx = dir === -1 ? n.nodeStartX - g.sLineDeltaXDefault: n.nodeEndX + g.sLineDeltaXDefault
    cx = dir === -1 ? n.nodeEndX : n.nodeStartX + w
    ayu = n.nodeY + (dir === -1 ? - n.maxH / 2 : - selfH / 2)
    ayd = n.nodeY + (dir === -1 ? + n.maxH / 2 : + selfH / 2)
    byu = n.nodeY - n.maxH / 2
    byd = n.nodeY + n.maxH / 2
    cyu = n.nodeY + (dir === -1 ? - selfH / 2 : - n.maxH / 2)
    cyd = n.nodeY + (dir === -1 ? + selfH / 2 : + n.maxH / 2)
  }
  return {ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd}
}

export const getPolygonC = (m: M): PolygonPoints => {
  let ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd
  if (isXACR(m)) {
    ax = getXA(m).slice().sort(sortPath).at(0)!.nodeStartX
    bx = cx = getXA(m).slice().sort(sortPath).at(-1)!.nodeEndX
    ayu = byu = cyu = getXA(m).slice().sort(sortPath).at(0)!.nodeY - getXA(m).slice().sort(sortPath).at(0)!.selfH / 2
    ayd = byd = cyd = getXA(m).slice().sort(sortPath).at(0)!.nodeY + getXA(m).slice().sort(sortPath).at(0)!.selfH / 2
  } else if (isXACC(m)) {
    ax = getXA(m).at(0)!.nodeStartX
    bx = cx = getXA(m).at(0)!.nodeEndX
    ayu = byu = cyu = getXA(m).slice().sort(sortPath).at(0)!.nodeY - getXA(m).slice().sort(sortPath).at(0)!.selfH / 2
    ayd = byd = cyd = getXA(m).slice().sort(sortPath).at(-1)!.nodeY + getXA(m).slice().sort(sortPath).at(-1)!.selfH / 2
  } else {
    ax = getX(m).nodeStartX
    bx = cx = getX(m).nodeEndX
    ayu = byu = cyu = getX(m).nodeY - getX(m).selfH / 2
    ayd = byd = cyd = getX(m).nodeY + getX(m).selfH / 2
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

export const calculateMiddlePoint = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5; // t = 0.5 for calculating the middle point
  const mt = 1 - t;
  const bx = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex;
  const by = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey;
  return {
    x: bx,
    y: by
  };
};
