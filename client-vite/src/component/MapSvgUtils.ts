import {getG, getNodeByPath, getPathDir, getRi, getSI1, getX, isD, isXACC, isXACR,} from "../core/MapUtils"
import {adjust} from "../core/Utils"
import {LineTypes} from "../state/Enums"
import {M, N} from "../state/MapStateTypes"

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
  let sx, sy, dx, dy, ex, ey
  sx = (dir === -1 ? na.nodeStartX : na.nodeEndX)
  sy = (na.nodeY)
  ex = (dir === -1 ? nb.nodeEndX : nb.nodeStartX)
  ey = (nb.nodeY)
  dx = (dir === -1 ? (na.nodeStartX - nb.nodeEndX) : (nb.nodeStartX - na.nodeEndX))
  dy = (nb.nodeY - na.nodeY)
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
  const xn = getX(m)
  const ni = getNodeByPath(m, getSI1(xn.path)) as N
  const n = getNodeByPath(m, xn.path)
  const dir = getPathDir(xn.path)
  let x, y, w, h
  if (isXACR(m)) {
    const i = xn.path.at(-2) as number
    x = dir === -1 ? ni.nodeEndX  : ni.nodeStartX
    y = - ni.maxRowHeight[i] / 2 + n.nodeY
    w = ni.selfW
    h = ni.maxRowHeight[i]
  } else if (isXACC(m)) {
    const j = xn.path.at(-1) as number
    x = dir === -1 ? ni.nodeEndX - ni.sumMaxColWidth[j] : ni.nodeStartX + ni.sumMaxColWidth[j]
    y = ni.nodeY - ni.selfH / 2
    w = ni.maxColWidth[j]
    h = ni.selfH
  } else {
    const i = xn.path.at(-2) as number
    const j = xn.path.at(-1) as number
    x = dir === -1 ? ni.nodeEndX - ni.sumMaxColWidth[j] : ni.nodeStartX + ni.sumMaxColWidth[j]
    y = - ni.maxRowHeight[i] / 2 + n.nodeY
    w = ni.maxColWidth[j]
    h = ni.maxRowHeight[i]
  }
  return {
    ax: x + (dir === -1 ? -w : 0),
    bx: x + dir * w,
    cx: x + (dir === 1 ? w : 0),
    ayu: y,
    ayd: y + h,
    byu: y,
    byd: y + h,
    cyu: y,
    cyd: y + h
  }
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
