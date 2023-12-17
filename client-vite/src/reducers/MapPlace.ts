import {getTaskWidth} from "../components/map/MapSvgUtils.ts"
import {getCountTCO2, getCountTSO1, getCountTSO2, getG, getTSI1, getTSI2, hasTask, isC, isCS, isCSC, isR, isRS, isRSC, isS, isSS, isSSC, isSU, mT} from "../selectors/MapSelector"
import {MARGIN_X} from "../state/Consts.ts"
import {PlaceTypes} from "../state/Enums.ts"
import {M, T} from "../state/MapStateTypes"

export const mapPlace = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.nodeStartX = ti.offsetW
        ti.nodeStartY = ti.offsetH
        ti.nodeEndX = ti.offsetW + ti.selfW + getTaskWidth(getG(m)) * hasTask(m, ti)
        ti.nodeEndY = ti.offsetH + ti.selfH
        break
      }
      case isS(ti.path): {
        const g = getG(m)
        const si1 = getTSI1(m, ti)
        const i = ti.path.at(-1)
        const sumUpperSiblingMaxH = mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * si1.spacing * + Boolean(getCountTSO2(m, si1) || getCountTCO2(m, si1))

        if (g.placeType === PlaceTypes.EXPLODED) {
          if (isRS(ti.path)) {
            ti.nodeStartX = MARGIN_X + si1.nodeStartX
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumElapsedY
          } else if (isSS(ti.path)) {
            ti.nodeStartX = si1.nodeEndX + g.sLineDeltaXDefault
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumElapsedY
          } else if (isCS(ti.path)) {
            ti.nodeStartX = si1.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + sumElapsedY
          }
        } else if (g.placeType === PlaceTypes.INDENTED) {

        }

        ti.nodeEndX = ti.nodeStartX + ti.selfW
        ti.nodeEndY = ti.nodeStartY + ti.selfH
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

        if (g.placeType === PlaceTypes.EXPLODED) {
          if (isRSC(ti.path)) {
            ti.nodeStartX = MARGIN_X + si2.nodeStartX + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2 - si1.selfH / 2
          } else if (isSSC(ti.path)) {
            ti.nodeStartX = si2.nodeEndX + g.sLineDeltaXDefault + si1.sumMaxColWidth[j]
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2 - si1.selfH / 2
          } else if (isCSC(ti.path)) {
            ti.nodeStartX = si2.nodeStartX + 2
            ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - ti.selfH / 2 + si1.sumMaxRowHeight[i] + si1.maxRowHeight[i] / 2 - si1.selfH / 2
          }
        } else if (g.placeType === PlaceTypes.INDENTED) {

        }

        ti.nodeEndX = ti.nodeStartX + ti.selfW
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
