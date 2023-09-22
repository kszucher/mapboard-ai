import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {getNodeByPath, isG, isR, isD, isS, isC, isSU, getPathPattern, getCountNSO1, getCountNSO2, getCountNCO2, getRi, getG, getPathDir, getNSI1, getNSI2} from "../selectors/MapSelector"
import {G, M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  m.forEach(n => {
    switch (true) {
      case isG(n.path): {
        // do nothing
        break
      }
      case isR(n.path): {
        const g = getG(m)
        n.nodeStartX = n.offsetW + Math.abs(g.maxL)  + MARGIN_X
        n.nodeEndX = n.offsetW + Math.abs(g.maxL) + n.selfW + MARGIN_X
        n.nodeY = n.offsetH + Math.abs(g.maxU) + MARGIN_Y
        break
      }
      case isD(n.path): {
        const ri = getRi(n.path)
        const rx = getNodeByPath(m, ['r', ri]) as T
        n.nodeStartX = rx.nodeStartX
        n.nodeEndX = rx.nodeEndX
        n.nodeY = rx.nodeY
        n.isTop = 1
        n.isBottom = 1
        break
      }
      case isS(n.path): {
        const p1 = getNSI1(m, n)
        const i = n.path.at(-1) as number
        const sumUpperSiblingMaxH = m.filter(nt => isSU(n.path, nt.path)).map(n => n.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * + Boolean(getCountNSO2(m, p1) || getCountNCO2(m, p1))
        if (getPathPattern(n.path).endsWith('ds') || getPathPattern(n.path).endsWith('ss')) {
          n.nodeStartX = getPathDir(n.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault : p1.nodeStartX - g.sLineDeltaXDefault - n.selfW
          n.nodeEndX = getPathDir(n.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault + n.selfW : p1.nodeStartX - g.sLineDeltaXDefault
        } else if (getPathPattern(n.path).endsWith('cs')) {
          n.nodeStartX = getPathDir(n.path) === 1 ? p1.nodeStartX + 2 : p1.nodeEndX - n.selfW
          n.nodeEndX = getPathDir(n.path) === 1 ? p1.nodeStartX + 2 + n.selfW : p1.nodeEndX
        }
        n.nodeY = p1.nodeY - p1.familyH / 2 + n.maxH / 2 + sumElapsedY
        n.isTop = i === 0 && p1.isTop ? 1 : 0
        n.isBottom = i === getCountNSO1(m, p1) - 1 && p1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(n.path): {
        const p1 = getNSI1(m, n) as T
        const p2 = getNSI2(m, n) as T
        const i = n.path.at(-2) as number
        const j = n.path.at(-1) as number
        if (getPathPattern(n.path).endsWith('dsc') || getPathPattern(n.path).endsWith('ssc')) {
          n.nodeStartX = getPathDir(n.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j] - p1.maxColWidth[j]
          n.nodeEndX = getPathDir(n.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j] + p1.maxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j]
        } else if (getPathPattern(n.path).endsWith('csc')) {
          n.nodeStartX = getPathDir(n.path) === 1 ? p2.nodeStartX + 2 : p2.nodeEndX - n.selfW
          n.nodeEndX = getPathDir(n.path) === 1 ? p2.nodeStartX + 2 + n.selfW : p2.nodeEndX
        }
        n.nodeY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2
        break
      }
    }
    if (Number.isInteger(n.nodeStartX)) {
      n.nodeStartX += getPathDir(n.path) === 1 ?  0.5 : - 0.5
      n.nodeEndX += getPathDir(n.path) === 1 ?  0.5 : - 0.5
    }
    if (Number.isInteger(n.nodeY)) {
      n.nodeY += 0.5
    }
  })
}
