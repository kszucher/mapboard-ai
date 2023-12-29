import {getCountTCO2, getCountTSO1, getCountTSO2, getG, getTSI1, getTSI2, isC, isCS, isCSC, isR, isRS, isRSC, isS, isSS, isSSC, isSU, mT} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {Flow} from "../state/Enums.ts"
import {M} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.nodeStartX = ti.offsetW
        ti.nodeStartY = ti.offsetH
        break
      }
      case isS(ti.path): {
        const g = getG(m)
        const i = ti.path.at(-1)
        const si1 = getTSI1(m, ti)
        const elapsed =
          mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0) +
          i * S_SPACING * + Boolean(getCountTSO2(m, si1) && g.flow === Flow.EXPLODED || getCountTCO2(m, si1))
        if (isRS(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = MARGIN_X + si1.nodeStartX
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = MARGIN_X + si1.nodeStartX
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2  + elapsed
          }
        } else if (isSS(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = si1.nodeStartX + INDENT
            ti.nodeStartY = si1.nodeStartY + si1.selfH + elapsed
          }
        } else if (isCS(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = si1.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = si1.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2  + elapsed
          }
        }
        ti.isTop = i === 0 && si1.isTop ? 1 : 0
        ti.isBottom = i === getCountTSO1(m, si1) - 1 && si1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        const g = getG(m)
        const si1 = getTSI1(m, ti)
        const si2 = getTSI2(m, ti)
        if (isRSC(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = MARGIN_X + si2.nodeStartX + ti.calcOffsetX
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = MARGIN_X + si2.nodeStartX + ti.calcOffsetX
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          }
        } else if (isSSC(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + ti.calcOffsetX
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = si2.nodeStartX + INDENT + 2 + ti.calcOffsetX
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          }
        } else if (isCSC(ti.path)) {
          if (g.flow === Flow.EXPLODED) {
            ti.nodeStartX = si2.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          } else if (g.flow === Flow.INDENTED) {
            ti.nodeStartX = si2.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
          }
        }
        break
      }
    }
  })
}
