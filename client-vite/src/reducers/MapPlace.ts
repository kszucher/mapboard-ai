import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {isR, isS, isC, isSU, getPathPattern, getCountTSO1, getCountTSO2, getCountTCO2, getG, getTSI1, getTSI2, mT} from "../selectors/MapSelector"
import {M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.nodeStartX = ti.offsetW + MARGIN_X
        ti.nodeEndX = ti.nodeStartX + ti.selfW
        ti.nodeY = ti.offsetH + MARGIN_Y + Math.max(...[ti.selfH, ti.familyH]) / 2
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
        if (getPathPattern(ti.path).endsWith('rs') || getPathPattern(ti.path).endsWith('ss')) {
          ti.nodeStartX = p1.nodeEndX + g.sLineDeltaXDefault
          ti.nodeEndX = p1.nodeEndX + g.sLineDeltaXDefault + ti.selfW
        } else if (getPathPattern(ti.path).endsWith('cs')) {
          ti.nodeStartX = p1.nodeStartX + 2
          ti.nodeEndX = p1.nodeStartX + 2 + ti.selfW
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
        if (getPathPattern(ti.path).endsWith('rsc') || getPathPattern(ti.path).endsWith('ssc')) {
          ti.nodeStartX = p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j]
          ti.nodeEndX = p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j] + p1.maxColWidth[j]
        } else if (getPathPattern(ti.path).endsWith('csc')) {
          ti.nodeStartX = p2.nodeStartX + 2
          ti.nodeEndX = p2.nodeStartX + 2 + ti.selfW
        }
        ti.nodeY = p1.nodeY + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH/2
        break
      }
    }
    if (Number.isInteger(ti.nodeStartX)) {
      ti.nodeStartX += 0.5
      ti.nodeEndX += 0.5
    }
    if (Number.isInteger(ti.nodeY)) {
      ti.nodeY += 0.5
    }
  })
}
