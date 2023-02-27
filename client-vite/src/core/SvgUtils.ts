import {LineTypes} from "./Types"
import {M, N} from "../types/DefaultProps"
import {isOdd} from "./Utils"

interface AdjustedParams {
  nsx: number,
  nex: number,
  nsy: number,
  ney: number,
  nsym: number,
  neym: number,
  sw: number,
  sh: number,
  totalW: number,
  deltaX: number,
  // margin: number,
  r: number
}

interface LinePoints {
  sx: number,
  sy: number,
  dx: number,
  dy: number,
  ex: number,
  ey: number
}

interface PolygonPoints {
  ax: number
  bx: number
  cx: number
  ayu: number
  ayd: number
  byu: number
  byd: number
  cyu: number
  cyd: number
}

const getDir = (n: N) => {
  return n.path[3] ? -1 : 1
}

export const getAdjustedParams = (n: N): AdjustedParams => {
  const dir = getDir(n)
  const selfHadj = isOdd(n.selfH) ? n.selfH + 1 : n.selfH
  const maxHadj = isOdd(n.maxH) ? n.maxH + 1 : n.maxH
  return {
    sw: n.selfW,
    sh: n.selfH,
    nsx: dir === -1 ? n.nodeEndX : n.nodeStartX,
    nex: dir === -1 ? n.nodeStartX : n.nodeEndX,
    nsy: n.nodeY - selfHadj / 2,
    ney: n.nodeY + selfHadj / 2,
    nsym: n.nodeY - maxHadj / 2,
    neym: n.nodeY + maxHadj / 2,
    totalW: n.familyW + n.selfW,
    deltaX: n.lineDeltaX,
    // margin: (
    //   (n.selection === 's' && n.sBorderColor !== '') ||
    //   (n.selection === 's' && n.sFillColor !== '') ||
    //   (n.selection === 'f') ||
    //   (n.taskStatus > 1) ||
    //   (n.hasCell)
    // ) ? 4 : -2,

    r: 8
  }
}

const getCoordsInLine = (a: any[], b: any[], dt: number) => {
  const [x0, y0] = a
  const [x1, y1] = b
  const d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  const t = dt / d
  const xt = (1 - t) * x0 + t * x1
  const yt = (1 - t) * y0 + t * y1
  return [xt, yt]
}

export const getBezierPath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) => {
  return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
}

const getEdgePath = (c: string, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]: number[]) => {
  return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
}

export const getLinePoints = (na: N, nb: N): LinePoints => {
  const dir = getDir(nb)
  let sx, sy, dx, dy, ex, ey
  sx = dir === -1 ? na.nodeStartX : na.nodeEndX
  if (nb.type === 'cell') {
    // TODO handle the case of parentNode being ROOT child
    sx = dir === -1 ? na.parentNodeStartX : na.parentNodeEndX
  }
  sx = isOdd(sx) ? sx - 0.5 : sx
  sy = na.nodeY
  dx = nb.lineDeltaX
  dy = nb.lineDeltaY
  ex = dir === -1 ? nb.nodeEndX : nb.nodeStartX
  ey = nb.nodeY
  return {sx, sy, dx, dy, ex, ey}
}

export const getLinePath = (n: N, linePoints: LinePoints) => {
  const dir = getDir(n)
  const {lineType} = n
  const {sx, sy, dx, dy, ex, ey} = linePoints
  let path
  if (lineType === LineTypes.bezier) {
    const c1x = sx + dir * dx / 4
    const c1y = sy
    const c2x = sx + dir * dx / 4
    const c2y = sy + dy
    path = getBezierPath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
  } else if (lineType === LineTypes.edge) {
    const m1x = sx + dir * dx / 2
    const m1y = sy
    const m2x = sx + dir * dx / 2
    const m2y = sy + dy
    path = getEdgePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
  }
  return path
}

export const getStructPolygonPoints = (selection: string, n: N): PolygonPoints => {
  const dir = getDir(n)
  const {  nsx, nex, nsy, ney, nsym, neym, totalW, deltaX, r } = getAdjustedParams(n)
  return selection === 's' ? {
    ax: dir === -1 ? nex : nsx,
    bx: nex - dir * r,
    cx: dir === -1 ? nsx : nex,
    ayu: nsy,
    ayd: ney,
    byu: nsy,
    byd: ney,
    cyu: nsy,
    cyd: ney
  } : {
    ax: dir === -1 ? nsx + dir * totalW : nsx,
    bx: nex + dir * deltaX,
    cx: dir === -1 ? nsx : nsx + dir * totalW,
    ayu: dir === -1 ? nsym : nsy,
    ayd: dir === -1 ? neym : ney,
    byu: nsym,
    byd: neym,
    cyu: dir === -1 ? nsy : nsym,
    cyd: dir === -1 ? ney : neym,
  }
}

export const getCellPolygonPoints = (m: M, n: N, i: number, j: number) : PolygonPoints => {
  const dir = getDir(n)
  const { nsx, nsy } = getAdjustedParams(n)
  let sx, sy, w, h
  if (m.g.sc.cellRowSelected) {
    sx = nsx
    sy = nsy + n.sumMaxRowHeight[i]
    w = n.selfW
    h = n.sumMaxRowHeight[i+1] - n.sumMaxRowHeight[i]
  } else if (m.g.sc.cellColSelected) {
    sx = nsx + dir*n.sumMaxColWidth[j]
    sy = nsy
    w = n.sumMaxColWidth[j+1] - n.sumMaxColWidth[j]
    h = n.selfH
  } else {
    sx = nsx + dir*n.sumMaxColWidth[j]
    sy = nsy + n.sumMaxRowHeight[i]
    w = n.sumMaxColWidth[j+1] - n.sumMaxColWidth[j]
    h = n.sumMaxRowHeight[i+1] - n.sumMaxRowHeight[i]
  }
  return {
    ax: dir === - 1 ? sx + dir * w : sx,
    bx: sx + dir*w,
    cx: dir === - 1 ? sx : sx + dir * w,
    ayu: sy,
    ayd: sy + h,
    byu: sy,
    byd: sy + h,
    cyu: sy,
    cyd: sy + h,
  }
}

export const getPolygonPath = (n: N, polygonPoints: PolygonPoints, selection: string, margin: number) => {
  const dir = getDir(n)
  let { ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd } = polygonPoints
  ax -= margin
  bx -= dir * margin
  cx += margin
  ayu -= margin
  ayd += margin
  byu -= margin
  byd += margin
  cyu -= margin
  cyd += margin
  const points = [[ax, ayu], [bx, byu], [cx, cyu], [cx, cyd], [bx, byd], [ax, ayd]]
  const radius = 12
  let path = ''
  for (let i = 0; i < points.length; i++) {
    const prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
    const currPoint = points[i]
    const nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
    const [sx, sy] = getCoordsInLine(currPoint, prevPoint, radius)
    const [c1x, c1y] = currPoint
    const [c2x, c2y] = currPoint
    const [ex, ey] = getCoordsInLine(currPoint, nextPoint, radius)
    if (selection === 's' && i === (dir === - 1 ? 4 : 1)) {
      path += getBezierPath('L', [sx, sy, sx, sy, sx, sy, ex - dir * 24, ey])
    } else if (selection === 's' && i === (dir === - 1 ? 1 : 4)) {
      path += getBezierPath('L', [sx - dir * 24, sy, ex, ey, ex, ey, ex, ey])
    } else {
      path += getBezierPath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    }
  }
  return path + 'z'
}

export const getArcPath = (n: N, margin: number, closed: boolean) => {
  const dir = getDir(n)
  const { nsx, nsy, sw, sh, r } = getAdjustedParams(n)
  const x1 = nsx - margin * dir
  const y1 = nsy + r - margin
  const horz = sw - 2 * r + 2 * margin
  const vert = sh - 2 * r + 2 * margin
  return dir === -1
    ? `M${x1},${y1}
      a${+r},${+r} 0 0 0 ${-r},${-r} h${-horz} 
      a${+r},${+r} 0 0 0 ${-r},${+r} v${+vert} 
      a${+r},${+r} 0 0 0 ${+r},${+r} h${+horz} 
      a${+r},${+r} 0 0 0 ${+r},${-r}
      ${closed ? 'Z' : ''}`
    : `M${x1},${y1} 
      a${+r},${+r} 0 0 1 ${+r},${-r} h${+horz}
      a${+r},${+r} 0 0 1 ${+r},${+r} v${+vert}
      a${+r},${+r} 0 0 1 ${-r},${+r} h${-horz}
      a${+r},${+r} 0 0 1 ${-r},${-r}
      ${closed ? 'Z' : ''}`
}
