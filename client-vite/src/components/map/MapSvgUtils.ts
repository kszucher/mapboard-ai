import {getG, isXACC, isXACR, getXAC, getXC, pathToC, pathToR, idToR} from "../../mapQueries/MapQueries.ts"
import {INDENT, TASK_CIRCLES_GAP, TASK_CIRCLES_NUM} from "../../state/Consts"
import {LineType, Flow, Side} from "../../state/Enums"
import {C, G, L, M, PR, R, S, T} from "../../state/MapStateTypes"
import {adjust} from "../../utils/Utils"
import {sortPath} from "../../mapMutations/MapSort.ts"

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
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

export const getCoordsMidBezier = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5
  const mt = 1 - t
  const x = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex
  const y = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey
  return {x, y}
}

export const getLinearLinePath = ({x1, x2, y1, y2} : {x1: number, x2: number, y1: number, y2: number}) => `M${x1},${y1} L${x2},${y2}`

export const getEdgeLinePath = (c: string, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]: number[]) => `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`

export const getBezierLinePath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) => `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`

export const getBezierLinePoints = ([ax, ay, bx, by]: number[]): number[] => {
  const dx = (bx - ax)
  const dy = (by - ay)
  return [ax, ay, ax + dx / 4, ay, ax + dx / 4, ay + dy, bx, by]
}

export const getNodeLinePath = (g: G, na: S | C, nb: S | C) => {
  const { lineType } = nb
  let sx = 0, sy = 0, ex = 0, ey = 0
  if (g.flow === Flow.EXPLODED) {
    sx = na.nodeStartX + na.selfW
    sy = na.nodeStartY + na.selfH / 2
    ex = nb.nodeStartX
    ey = nb.nodeStartY + nb.selfH / 2
  } else if (g.flow === Flow.INDENTED) {
    sx = na.nodeStartX + INDENT / 2
    sy = na.nodeStartY + na.selfH
    ex = nb.nodeStartX
    ey = nb.nodeStartY + nb.selfH / 2
  }
  sx = Math.round(sx) + .5
  sy = Math.round(sy) + .5
  ex = Math.round(ex) + .5
  ey = Math.round(ey) + .5
  const dx = ex - sx
  const dy = ey - sy
  let path
  if (lineType === LineType.bezier) {
    let c1x = 0, c1y = 0, c2x = 0, c2y = 0
    if (g.flow === Flow.EXPLODED) {
      c1x = sx + dx / 4
      c1y = sy
      c2x = sx + dx / 4
      c2y = sy + dy
    } else if (g.flow === Flow.INDENTED) {
      c1x = sx
      c1y = ey
      c2x = sx
      c2y = ey
    }
    path = getBezierLinePath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
  } else if (lineType === LineType.edge) {
    let m1x = 0, m1y = 0, m2x = 0, m2y = 0
    if (g.flow === Flow.EXPLODED) {
      m1x = sx + dx / 2
      m1y = sy
      m2x = sx + dx / 2
      m2y = sy + dy
    } else if (g.flow === Flow.INDENTED) {
      m1x = sx
      m1y = ey
      m2x = sx
      m2y = ey
    }
    path = getEdgeLinePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
  }
  return path
}

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

export const getPolygonPath = (m: M, t: T, mode: string, margin: number) => {
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
    case 'sFamily': {
      const g = getG(m)
      if (g.flow === Flow.EXPLODED) {
        const g = getG(m)
        ax = t.nodeStartX
        bx = t.nodeStartX + t.selfW + g.sLineDeltaXDefault
        cx = t.nodeStartX + t.maxW
        ayu = t.nodeStartY
        ayd = t.nodeStartY + t.selfH
        byu = t.nodeStartY + t.selfH / 2 - t.maxH / 2
        byd = t.nodeStartY + t.selfH / 2 + t.maxH / 2
        cyu = t.nodeStartY + t.selfH / 2 - t.maxH / 2
        cyd = t.nodeStartY + t.selfH / 2 + t.maxH / 2
      } else if (g.flow === Flow.INDENTED) {
        ax = t.nodeStartX
        bx = t.nodeStartX + INDENT
        cx = t.nodeStartX + t.maxW
        ayu = t.nodeStartY
        ayd = t.nodeStartY + t.maxH
        byu = t.nodeStartY
        byd = t.nodeStartY + t.maxH
        cyu = t.nodeStartY
        cyd = t.nodeStartY + t.maxH
      }
      break
    }
    case 'c': {
      if (isXACR(m)) {
        const xac = getXAC(m).slice().sort(sortPath)
        ax = xac.at(0)!.nodeStartX
        bx = cx = xac.at(-1)!.nodeStartX + xac.at(-1)!.selfW
        ayu = byu = cyu = xac.at(0)!.nodeStartY
        ayd = byd = cyd = xac.at(0)!.nodeStartY + xac.at(0)!.selfH
      } else if (isXACC(m)) {
        const xac = getXAC(m).slice().sort(sortPath)
        ax = xac.at(0)!.nodeStartX
        bx = cx = xac.at(0)!.nodeStartX + xac.at(0)!.selfW
        ayu = byu = cyu = xac.at(0)!.nodeStartY
        ayd = byd = cyd = xac.at(-1)!.nodeStartY + xac.at(-1)!.selfH
      } else {
        const x = getXC(m)
        ax = x.nodeStartX
        bx = cx = x.nodeStartX + x.selfW
        ayu = byu = cyu = x.nodeStartY
        ayd = byd = cyd = x.nodeStartY + x.selfH
      }
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

export const getArcPath = (s: S, margin: number, closed: boolean) => {
  const R = 8
  const xi = s.nodeStartX
  const yu = s.nodeStartY
  let x1 = adjust(xi - margin)
  let y1 = adjust(yu + R - margin)
  let dx = s.selfW - 2 * R + 2 * margin
  let dy = s.selfH - 2 * R + 2 * margin
  return (
    `M${x1},${y1} 
    a${+R},${+R} 0 0 1 ${+R},${-R} h${+dx}
    a${+R},${+R} 0 0 1 ${+R},${+R} v${+dy}
    a${+R},${+R} 0 0 1 ${-R},${+R} h${-dx}
    a${+R},${+R} 0 0 1 ${-R},${-R}
    ${closed ? 'Z' : ''}`
  )
}

export const getGridPath = (m: M, s: S) => {
  const xi = s.nodeStartX
  const yu = s.nodeStartY
  const yd = s.nodeStartY + s.selfH
  let path = ''
  let rowCount = s.co1.at(0)!.cv.length
  let colCount = s.co1.at(0)!.ch.length
  for (let i = 1; i < rowCount; i++) {
    const ci = pathToC(m, [...s.path, 'c', i, 0])
    const x1 = adjust(s.nodeStartX)
    const x2 = adjust(s.nodeStartX + s.selfW)
    const cu = ci.cu
    const calcOffsetY = cu.reduce((a, b) => a + b.selfH, 0)
    const y = adjust(yu + calcOffsetY)
    path += `M${x1},${y} L${x2},${y}`
  }
  for (let j = 1; j < colCount; j++) {
    const ci = pathToC(m, [...s.path, 'c', 0, j])
    const cl = ci.cl
    const calcOffsetX = cl.reduce((a, b) => a + b.selfW, 0)
    const x = adjust(xi + calcOffsetX)
    path += `M${x},${yu} L${x},${yd}`
  }
  return path
}

export const getTaskWidth = (g: G) => TASK_CIRCLES_NUM * (g.density === 'large' ? 24 : 20) + (TASK_CIRCLES_NUM - 1) * TASK_CIRCLES_GAP + 40

export const getTaskRadius = (g: G) => g.density === 'large' ? 24 : 20

export const getTaskStartPoint = (m: M, g: G, s: S) => pathToR(m, s.path.slice(0, 2) as PR).nodeStartX + pathToR(m, s.path.slice(0, 2) as PR).selfW - getTaskWidth(g)
