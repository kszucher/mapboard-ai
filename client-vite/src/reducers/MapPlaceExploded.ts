import {getG, getTSI1, getTSI2, isC, isCS, isCSC, isR, isRS, isRSC, isS, isSS, isSSC, isSU, mT} from "../queries/MapQueries.ts"
import {MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {M} from "../state/MapStateTypes"

export const mapPlaceExploded = (m: M) => {
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
        const elapsed = mT(m).filter(nt => isSU(ti.path, nt.path)).map(ti => ti.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.countTSO2 || si1.countTCO2)
        if (isRS(ti.path)) {
          ti.nodeStartX = MARGIN_X + si1.nodeStartX
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        } else if (isSS(ti.path)) {
          ti.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        } else if (isCS(ti.path)) {
          ti.nodeStartX = si1.nodeStartX + 2
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        }
        break
      }
      case isC(ti.path): {
        const g = getG(m)
        const si1 = getTSI1(m, ti)
        const si2 = getTSI2(m, ti)
        if (isRSC(ti.path)) {
          ti.nodeStartX = MARGIN_X + si2.nodeStartX + ti.calcOffsetX
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        } else if (isSSC(ti.path)) {
          ti.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + ti.calcOffsetX
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        } else if (isCSC(ti.path)) {
          ti.nodeStartX = si2.nodeStartX + 2
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        }
        break
      }
    }
  })
}
