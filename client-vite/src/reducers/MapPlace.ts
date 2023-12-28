import {getCountTCO2, getCountTSO1, getCountTSO2, getG, getTSI1, getTSI2, isC, isCS, isCSC, isR, isRS, isRSC, isS, isSS, isSSC, isSU, mT} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X} from "../state/Consts.ts"
import {PlaceType} from "../state/Enums.ts"
import {M, T} from "../state/MapStateTypes"

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
        const si1 = getTSI1(m, ti)
        const i = ti.path.at(-1)
        const sumMaxH = mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0)
        const sumSpacing = i * si1.spacing * + Boolean(getCountTSO2(m, si1) || getCountTCO2(m, si1))
        if (isRS(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = MARGIN_X + si1.nodeStartX
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumMaxH + sumSpacing
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = MARGIN_X + si1.nodeStartX
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2  + sumMaxH + sumSpacing
          }
        } else if (isSS(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = si1.nodeEndX + g.sLineDeltaXDefault
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumMaxH + sumSpacing
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = si1.nodeStartX + INDENT
            ti.nodeStartY = si1.nodeEndY + sumMaxH + sumSpacing
          }
        } else if (isCS(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = si1.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumMaxH + sumSpacing
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = si1.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2  + sumMaxH + sumSpacing
          }
        }
        ti.isTop = i === 0 && si1.isTop ? 1 : 0
        ti.isBottom = i === getCountTSO1(m, si1) - 1 && si1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        const g = getG(m)
        const si1 = getTSI1(m, ti) as T
        const si2 = getTSI2(m, ti) as T
        const i = ti.path.at(-2)
        const j = ti.path.at(-1)
        if (isRSC(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = MARGIN_X + si2.nodeStartX + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = MARGIN_X + si2.nodeStartX + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          }
        } else if (isSSC(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = si2.nodeEndX + g.sLineDeltaXDefault + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = si2.nodeStartX + INDENT + 2 + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          }
        } else if (isCSC(ti.path)) {
          if (g.placeType === PlaceType.EXPLODED) {
            ti.nodeStartX = si2.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.nodeStartX = si2.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2
          }
        }
        break
      }
    }
    ti.nodeEndX = ti.nodeStartX + ti.selfW
    ti.nodeEndY = ti.nodeStartY + ti.selfH
  })
}
