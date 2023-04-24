import {getNodeByPath, getP1, getP2, isG, isR, isD, isS, isC, isSU, getPattern} from "./MapUtils"
import {G, M, N} from "../state/MapPropTypes"

export const mapPlace = (m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  const r0 = getNodeByPath(m, ['r', 0]) as N
  m.forEach(n => {
    if (isG(n.path)) {
      // do nothing
    } else if (isR(n.path)) {
      n.lineDeltaX = 0
      n.lineDeltaY = g.mapHeight / 2 - 0.5
      n.nodeStartX = g.mapStartCenterX - n.selfW / 2 + 1
      n.nodeEndX = g.mapStartCenterX + n.selfW / 2 + 1
      n.nodeY = n.lineDeltaY
    } else if (isD(n.path)) {
      n.lineDeltaX = 0
      n.lineDeltaY = 0
      n.nodeStartX = r0.nodeStartX
      n.nodeEndX = r0.nodeEndX
      n.nodeY = r0.lineDeltaY
      n.isTop = 1
      n.isBottom = 1
      n.selfW = r0.selfW // THIS SHOULD HAVE BEEN ASSIGNED IN MapMeasure
      n.selfH = r0.selfH // THIS SHOULD HAVE BEEN ASSIGNED IN MapMeasure
    } else {
      const p1 = getNodeByPath(m, getP1(n.path)) as N
      const p2 = getNodeByPath(m, getP2(n.path)) as N
      if (isS(n.path)) {
        const i = n.path.at(-1) as number
        const sumUpperSiblingMaxH = m.filter(nt => isSU(n.path, nt.path)).map(n => n.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * p1.spacingActivated
        n.lineDeltaX = g.sLineDeltaXDefault
        n.lineDeltaY = - p1.familyH / 2 + n.maxH / 2 + sumElapsedY
        if (getPattern(n.path).endsWith('ds') || getPattern(n.path).endsWith('ss')) {
          n.nodeStartX = n.path[3] === 0 ? p1.nodeEndX + n.lineDeltaX : p1.nodeStartX - n.lineDeltaX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p1.nodeEndX + n.lineDeltaX + n.selfW : p1.nodeStartX - n.lineDeltaX
        } else if (getPattern(n.path).endsWith('cs')) {
          n.nodeStartX = n.path[3] === 0 ? p1.nodeStartX + 2 : p1.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p1.nodeStartX + 2 + n.selfW : p1.nodeEndX
        }
        n.nodeY = p1.nodeY + n.lineDeltaY
        n.isTop = i === 0 && p1.isTop ? 1 : 0
        n.isBottom = i === p1.sCount - 1 && p1.isBottom === 1 ? 1 : 0
      } else if (isC(n.path)) {
        const i = n.path.at(-2) as number
        const j = n.path.at(-1) as number
        n.lineDeltaX = p1.sumMaxColWidth[j] + 20
        n.lineDeltaY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2 - p2.nodeY
        if (getPattern(n.path).endsWith('dsc') || getPattern(n.path).endsWith('ssc')) {
          const diff = g.sLineDeltaXDefault - 20
          n.nodeStartX = n.path[3] === 0 ? p2.nodeEndX + n.lineDeltaX + diff : p2.nodeStartX - n.lineDeltaX - diff
          n.nodeEndX = n.path[3] === 0 ? p2.nodeEndX + n.lineDeltaX + diff + n.selfW : p2.nodeStartX - n.lineDeltaX - diff
        } else if (getPattern(n.path).endsWith('csc')) {
          n.nodeStartX = n.path[3] === 0 ? p2.nodeStartX + 2 : p2.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p2.nodeStartX + 2 + n.selfW : p2.nodeEndX
        }
        n.nodeY = p2.nodeY + n.lineDeltaY
      }
    }
    if (Number.isInteger(n.nodeStartX)) {
      n.nodeStartX += n.path[3] === 0 ?  0.5 : - 0.5
      n.nodeEndX += n.path[3] === 0 ?  0.5 : - 0.5
    }
    if (Number.isInteger(n.nodeY)) {
      n.nodeY += 0.5
    }
  })
}
