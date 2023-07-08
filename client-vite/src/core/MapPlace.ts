import {getNodeByPath, getSI1, getSI2, isG, isR, isD, isS, isC, isSU, getPathPattern, getCountSO1, getCountSO2, getCountCO2} from "./MapUtils"
import {G, M, N} from "../state/MapPropTypes"

export const mapPlace = (m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  const r0 = getNodeByPath(m, ['r', 0]) as N
  m.forEach(n => {
    switch (true) {
      case isG(n.path): {
        // do nothing
        break
      }
      case isR(n.path): {
        n.nodeStartX = g.mapStartCenterX - n.selfW / 2 + 1
        n.nodeEndX = g.mapStartCenterX + n.selfW / 2 + 1
        n.nodeY = g.mapHeight / 2 - 0.5
        break
      }
      case isD(n.path): {
        n.nodeStartX = r0.nodeStartX
        n.nodeEndX = r0.nodeEndX
        n.nodeY = g.mapHeight / 2 - 0.5
        n.isTop = 1
        n.isBottom = 1
        break
      }
      case isS(n.path): {
        const p1 = getNodeByPath(m, getSI1(n.path)) as N
        const i = n.path.at(-1) as number
        const sumUpperSiblingMaxH = m.filter(nt => isSU(n.path, nt.path)).map(n => n.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * + Boolean(getCountSO2(m, p1.path) || getCountCO2(m, p1.path))
        if (getPathPattern(n.path).endsWith('ds') || getPathPattern(n.path).endsWith('ss')) {
          n.nodeStartX = n.path[3] === 0 ? p1.nodeEndX + g.sLineDeltaXDefault : p1.nodeStartX - g.sLineDeltaXDefault - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p1.nodeEndX + g.sLineDeltaXDefault + n.selfW : p1.nodeStartX - g.sLineDeltaXDefault
        } else if (getPathPattern(n.path).endsWith('cs')) {
          n.nodeStartX = n.path[3] === 0 ? p1.nodeStartX + 2 : p1.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p1.nodeStartX + 2 + n.selfW : p1.nodeEndX
        }
        n.nodeY = p1.nodeY - p1.familyH / 2 + n.maxH / 2 + sumElapsedY
        n.isTop = i === 0 && p1.isTop ? 1 : 0
        n.isBottom = i === getCountSO1(m, p1.path) - 1 && p1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(n.path): {
        const p1 = getNodeByPath(m, getSI1(n.path)) as N
        const p2 = getNodeByPath(m, getSI2(n.path)) as N
        const i = n.path.at(-2) as number
        const j = n.path.at(-1) as number
        if (getPathPattern(n.path).endsWith('dsc') || getPathPattern(n.path).endsWith('ssc')) {
          n.nodeStartX = n.path[3] === 0 ? p2.nodeEndX + p1.sumMaxColWidth[j] + g.sLineDeltaXDefault : 0
          n.nodeEndX = n.path[3] === 0 ? 0 : p2.nodeStartX - p1.sumMaxColWidth[j] - g.sLineDeltaXDefault
        } else if (getPathPattern(n.path).endsWith('csc')) {
          n.nodeStartX = n.path[3] === 0 ? p2.nodeStartX + 2 : p2.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? p2.nodeStartX + 2 + n.selfW : p2.nodeEndX
        }
        n.nodeY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2
        break
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
