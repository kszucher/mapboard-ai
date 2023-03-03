import {LineTypes} from "./Types"
import {M, N} from "../types/DefaultProps"
import {isOdd} from "./Utils"
import {getMapData} from "./MapFlow";

type AdjustedParams = Record<'xi' | 'xo' | 'yu' | 'yd' | 'myu' | 'myd', number>
type PolygonPoints = Record<'ax' | 'bx' | 'cx' | 'ayu' | 'ayd' | 'byu' | 'byd' | 'cyu' | 'cyd', number>

const getDir = (n: N) => {
  return n.path[3] ? -1 : 1
}

const getAdjustedParams = (n: N): AdjustedParams => {
  const dir = getDir(n)
  const selfHadj = isOdd(n.selfH) ? n.selfH + 1 : n.selfH
  const maxHadj = isOdd(n.maxH) ? n.maxH + 1 : n.maxH
  return {
    xi: dir === -1 ? n.nodeEndX : n.nodeStartX,
    xo: dir === -1 ? n.nodeStartX : n.nodeEndX,
    yu: n.nodeY - selfHadj / 2,
    yd: n.nodeY + selfHadj / 2,
    myu: n.nodeY - maxHadj / 2,
    myd: n.nodeY + maxHadj / 2,
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

const getBezierPath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) => {
  return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
}

const getEdgePath = (c: string, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]: number[]) => {
  return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
}

export const getLinePath = (na: N, nb: N) => {
  const dir = getDir(nb)
  const { lineType } = nb
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

export const getPolygonPath = (m: M, n: N, selection: string, margin: number) => {
  const R = 8
  let pp: PolygonPoints
  let dir
  if (['c', 'cr', 'cc'].includes(m.g.sc.scope)) {
    dir = getDir(n)
    const { xi, yu } = getAdjustedParams(n)
    const i = m.g.sc.cellRowSelected
    const j = m.g.sc.cellColSelected
    let x, y, w, h
    if (m.g.sc.scope === 'cr') {
      x = xi
      y = yu + n.sumMaxRowHeight[i]
      w = n.selfW
      h = n.sumMaxRowHeight[i+1] - n.sumMaxRowHeight[i]
    } else if (m.g.sc.scope === 'cc') {
      x = xi + dir*n.sumMaxColWidth[j]
      y = yu
      w = n.sumMaxColWidth[j+1] - n.sumMaxColWidth[j]
      h = n.selfH
    } else {
      x = xi + dir*n.sumMaxColWidth[j]
      y = yu + n.sumMaxRowHeight[i]
      w = n.sumMaxColWidth[j+1] - n.sumMaxColWidth[j]
      h = n.sumMaxRowHeight[i+1] - n.sumMaxRowHeight[i]
    }
    pp = {
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
  } else {
    dir = getDir(n)
    const { xi, xo, yu, yd, myu, myd } = getAdjustedParams(n)
    const w = n.familyW + n.selfW
    pp = selection === 's' ? {
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
      bx: xo + dir * n.lineDeltaX,
      cx: xi + (dir === 1 ? w : 0),
      ayu: dir === -1 ? myu : yu,
      ayd: dir === -1 ? myd : yd,
      byu: myu,
      byd: myd,
      cyu: dir === -1 ? yu : myu,
      cyd: dir === -1 ? yd : myd
    }
  }
  let { ax, bx, cx, ayu, ayd, byu, byd, cyu, cyd} = pp
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
  const R = 8
  const dir = getDir(n)
  const { xi, yu } = getAdjustedParams(n)
  const x1 = xi - margin * dir
  const y1 = yu + R - margin
  const dx = n.selfW - 2 * R + 2 * margin
  const dy = n.selfH - 2 * R + 2 * margin
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
  const dir = getDir(n)
  const { xi, yu, yd } = getAdjustedParams(n)
  let path = ''
  for (let i = 1; i < n.sumMaxRowHeight.length - 1; i++) {
    const x1 = n.nodeStartX
    const x2 = n.nodeEndX
    const y = yu + n.sumMaxRowHeight[i]
    path += `M${x1},${y} L${x2},${y}`
  }
  for (let j = 1; j < n.sumMaxColWidth.length - 1; j++) {
    const x = xi + dir*n.sumMaxColWidth[j]
    path += `M${x},${yu} L${x},${yd}`
  }
  return path
}

const getTaskStartPoint = (m: M, n: N) => {
  const { mapWidth, margin, taskConfigWidth } = m.g
  const dir = getDir(n)
  let startX
  if (n.path.includes('c')) {
    const coverCellPath = n.path.slice(0, n.path.lastIndexOf('c'))
    const currCol = n.path[n.path.lastIndexOf('c') + 2]
    const coverCellRef = getMapData(m, coverCellPath)
    startX =
      (dir === - 1
        ? coverCellRef.nodeEndX
        : coverCellRef.nodeStartX
      ) +
      dir * (coverCellRef.sumMaxColWidth[currCol] + coverCellRef.maxColWidth[currCol] - 120)
  } else {
    startX = (dir === 1 ? mapWidth : 0) - dir * (margin + taskConfigWidth)
  }
  return startX
}

export const getTaskPath = (m: M, n: N) => {
  const { xo } = getAdjustedParams(n)
  const x1 = xo
  const x2 = getTaskStartPoint(m, n)
  const y = n.nodeY
  return `M${x1},${y} L${x2},${y}`
}

export const getTaskCircle = (m: M, n: N, i: number) => {
  const dir = getDir(n)
  const { taskConfigD, taskConfigGap } = m.g
  const cx = getTaskStartPoint(m, n) + dir * ( taskConfigD/2 + i * (taskConfigD + taskConfigGap))
  const cy = n.nodeY
  const r = taskConfigD / 2
  return { cx, cy, r }
}
