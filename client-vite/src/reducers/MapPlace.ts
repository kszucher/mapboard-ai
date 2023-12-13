import {getTaskWidth} from "../components/map/MapSvgUtils.ts";
import {isR, isS, isC, isSU, getPathPattern, getCountTSO1, getCountTSO2, getCountTCO2, getG, getTSI1, getTSI2, mT, hasTask} from "../selectors/MapSelector"
import {MARGIN_X} from "../state/Consts.ts"
import {M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.nodeStartX = ti.offsetW
        ti.nodeEndX = ti.offsetW + ti.selfW + getTaskWidth(getG(m)) * (hasTask(m, ti))
        ti.nodeStartY = ti.offsetH
        ti.nodeEndY = ti.offsetH + ti.selfH
        break
      }
      case isS(ti.path): {
        const g = getG(m)
        const p1 = getTSI1(m, ti)
        const i = ti.path.at(-1)
        const sumUpperSiblingMaxH = mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * p1.spacing * + Boolean(getCountTSO2(m, p1) || getCountTCO2(m, p1))
        if (getPathPattern(ti.path).endsWith('rs')) {
          ti.nodeStartX = p1.nodeStartX + MARGIN_X
        } else if (getPathPattern(ti.path).endsWith('cs')) {
          ti.nodeStartX = p1.nodeStartX + 2
        } else if (getPathPattern(ti.path).endsWith('ss')) {
          ti.nodeStartX = p1.nodeEndX + g.sLineDeltaXDefault
        }
        ti.nodeEndX = ti.nodeStartX + ti.selfW
        ti.nodeStartY = p1.nodeStartY + p1.selfH / 2 - p1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumElapsedY
        ti.nodeEndY = ti.nodeStartY + ti.selfH
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
        if (getPathPattern(ti.path).endsWith('rsc')) {
          ti.nodeStartX = p2.nodeStartX + MARGIN_X
        } else if (getPathPattern(ti.path).endsWith('csc'))  {
          ti.nodeStartX = p2.nodeStartX + 2
        } else if (getPathPattern(ti.path).endsWith('ssc')) {
          ti.nodeStartX = p2.nodeEndX + g.sLineDeltaXDefault + p1.sumMaxColWidth[j]
        }
        ti.nodeEndX = ti.nodeStartX + ti.selfW
        ti.nodeStartY = p1.nodeStartY + p1.selfH / 2 - ti.selfH / 2 + p1.sumMaxRowHeight[i] + p1.maxRowHeight[i]/2 - p1.selfH / 2
        ti.nodeEndY = ti.nodeStartY + ti.selfH
        break
      }
    }
    if (Number.isInteger(ti.nodeStartX)) {
      ti.nodeStartX += 0.5
      ti.nodeEndX += 0.5
    }
    if (Number.isInteger(ti.nodeStartY)) {
      ti.nodeStartY += 0.5
      ti.nodeEndY += 0.5
    }
  })
}
