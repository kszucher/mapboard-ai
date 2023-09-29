import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {isR, isD, isS, isC, isSU, getPathPattern, getCountTSO1, getCountTSO2, getCountTCO2, getG, getPathDir, getTSI1, getTSI2, mT, getTR} from "../selectors/MapSelector"
import {M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        const g = getG(m)
        ti.nodeStartX = ti.offsetW + Math.abs(g.maxL)  + MARGIN_X
        ti.nodeEndX = ti.offsetW + Math.abs(g.maxL) + ti.selfW + MARGIN_X
        ti.nodeY = ti.offsetH + Math.abs(g.maxU) + MARGIN_Y
        break
      }
      case isD(ti.path): {
        const nr = getTR(m, ti)
        ti.nodeStartX = nr.nodeStartX
        ti.nodeEndX = nr.nodeEndX
        ti.nodeY = nr.nodeY
        ti.isTop = 1
        ti.isBottom = 1
        break
      }
      case isS(ti.path): {
        const g = getG(m)
        const p1 = getTSI1(m, ti)
        const i = ti.path.at(-1)
        const sumUpperSiblingMaxH = mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * + Boolean(getCountTSO2(m, p1) || getCountTCO2(m, p1))
        if (getPathPattern(ti.path).endsWith('ds') || getPathPattern(ti.path).endsWith('ss')) {
          ti.nodeStartX = getPathDir(ti.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault : p1.nodeStartX - g.sLineDeltaXDefault - ti.selfW
          ti.nodeEndX = getPathDir(ti.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault + ti.selfW : p1.nodeStartX - g.sLineDeltaXDefault
        } else if (getPathPattern(ti.path).endsWith('cs')) {
          ti.nodeStartX = getPathDir(ti.path) === 1 ? p1.nodeStartX + 2 : p1.nodeEndX - ti.selfW
          ti.nodeEndX = getPathDir(ti.path) === 1 ? p1.nodeStartX + 2 + ti.selfW : p1.nodeEndX
        }
        ti.nodeY = p1.nodeY - p1.familyH / 2 + ti.maxH / 2 + sumElapsedY
        ti.isTop = i === 0 && p1.isTop ? 1 : 0
        ti.isBottom = i === getCountTSO1(m, p1) - 1 && p1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        const g = getG(m)
        const p1 = getTSI1(m, ti) as T
        const p2 = getTSI2(m, ti) as T
        const i = ti.path.at(-2)
        const j = ti.path.at(-1)
        if (getPathPattern(ti.path).endsWith('dsc') || getPathPattern(ti.path).endsWith('ssc')) {
          ti.nodeStartX = getPathDir(ti.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j] - p1.maxColWidth[j]
          ti.nodeEndX = getPathDir(ti.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j] + p1.maxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j]
        } else if (getPathPattern(ti.path).endsWith('csc')) {
          ti.nodeStartX = getPathDir(ti.path) === 1 ? p2.nodeStartX + 2 : p2.nodeEndX - ti.selfW
          ti.nodeEndX = getPathDir(ti.path) === 1 ? p2.nodeStartX + 2 + ti.selfW : p2.nodeEndX
        }
        ti.nodeY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2
        break
      }
    }
    if (Number.isInteger(ti.nodeStartX)) {
      ti.nodeStartX += getPathDir(ti.path) === 1 ?  0.5 : - 0.5
      ti.nodeEndX += getPathDir(ti.path) === 1 ?  0.5 : - 0.5
    }
    if (Number.isInteger(ti.nodeY)) {
      ti.nodeY += 0.5
    }
  })
}
