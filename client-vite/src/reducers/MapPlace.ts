import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {isR, isD, isS, isC, isSU, getPathPattern, getCountTSO1, getCountTSO2, getCountTCO2, getG, getPathDir, getTSI1, getTSI2, mT, mG, mL, getTR} from "../selectors/MapSelector"
import {M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mG(m).forEach(g => {})
  mL(m).forEach(l => {})
  mT(m).forEach(t => {
    switch (true) {
      case isR(t.path): {
        const g = getG(m)
        t.nodeStartX = t.offsetW + Math.abs(g.maxL)  + MARGIN_X
        t.nodeEndX = t.offsetW + Math.abs(g.maxL) + t.selfW + MARGIN_X
        t.nodeY = t.offsetH + Math.abs(g.maxU) + MARGIN_Y
        break
      }
      case isD(t.path): {
        const nr = getTR(m, t)
        t.nodeStartX = nr.nodeStartX
        t.nodeEndX = nr.nodeEndX
        t.nodeY = nr.nodeY
        t.isTop = 1
        t.isBottom = 1
        break
      }
      case isS(t.path): {
        const g = getG(m)
        const p1 = getTSI1(m, t)
        const i = t.path.at(-1) as number
        const sumUpperSiblingMaxH = mT(m).filter(nt => isSU(t.path, nt.path)).map(t => t.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * + Boolean(getCountTSO2(m, p1) || getCountTCO2(m, p1))
        if (getPathPattern(t.path).endsWith('ds') || getPathPattern(t.path).endsWith('ss')) {
          t.nodeStartX = getPathDir(t.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault : p1.nodeStartX - g.sLineDeltaXDefault - t.selfW
          t.nodeEndX = getPathDir(t.path) === 1 ? p1.nodeEndX + g.sLineDeltaXDefault + t.selfW : p1.nodeStartX - g.sLineDeltaXDefault
        } else if (getPathPattern(t.path).endsWith('cs')) {
          t.nodeStartX = getPathDir(t.path) === 1 ? p1.nodeStartX + 2 : p1.nodeEndX - t.selfW
          t.nodeEndX = getPathDir(t.path) === 1 ? p1.nodeStartX + 2 + t.selfW : p1.nodeEndX
        }
        t.nodeY = p1.nodeY - p1.familyH / 2 + t.maxH / 2 + sumElapsedY
        t.isTop = i === 0 && p1.isTop ? 1 : 0
        t.isBottom = i === getCountTSO1(m, p1) - 1 && p1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(t.path): {
        const g = getG(m)
        const p1 = getTSI1(m, t) as T
        const p2 = getTSI2(m, t) as T
        const i = t.path.at(-2) as number
        const j = t.path.at(-1) as number
        if (getPathPattern(t.path).endsWith('dsc') || getPathPattern(t.path).endsWith('ssc')) {
          t.nodeStartX = getPathDir(t.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j] - p1.maxColWidth[j]
          t.nodeEndX = getPathDir(t.path) === 1
            ? p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j] + p1.maxColWidth[j]
            : p2.nodeStartX - g.sLineDeltaXDefault - p1.sumMaxColWidth[j]
        } else if (getPathPattern(t.path).endsWith('csc')) {
          t.nodeStartX = getPathDir(t.path) === 1 ? p2.nodeStartX + 2 : p2.nodeEndX - t.selfW
          t.nodeEndX = getPathDir(t.path) === 1 ? p2.nodeStartX + 2 + t.selfW : p2.nodeEndX
        }
        t.nodeY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2
        break
      }
    }
    if (Number.isInteger(t.nodeStartX)) {
      t.nodeStartX += getPathDir(t.path) === 1 ?  0.5 : - 0.5
      t.nodeEndX += getPathDir(t.path) === 1 ?  0.5 : - 0.5
    }
    if (Number.isInteger(t.nodeY)) {
      t.nodeY += 0.5
    }
  })
}
