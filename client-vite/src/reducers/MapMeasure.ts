import {getTaskWidth} from "../components/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {M} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"
import {getCountTCO1, getNodeById, getRL, isC, isD, isR, isS, hasTaskLeft, hasTaskRight, getCountTSO1, getTRD1, getTRD0, getTR, mT, mG} from "../selectors/MapSelector"

export const mapMeasure = (pm: M, m: M) => {
  mT(m).toReversed().forEach(ti => {
    const pt = getNodeById(pm, ti.nodeId)
    switch (true) {
      case isR(ti.path): {
        measureText(m, pt, ti)
        break
      }
      case isD(ti.path): {
        if (getCountTSO1(m, ti)) {
          measureFamily(m, ti)
        }
        ti.maxW = ti.familyW
        ti.maxH = ti.familyH
        break
      }
      case isS(ti.path): {
        if (getCountTCO1(m, ti)) {
          measureTable(m, ti)
        } else {
          measureText(m, pt, ti)
        }
        if (getCountTSO1(m, ti)) {
          measureFamily(m, ti)
        }
        ti.maxW = ti.selfW + ti.familyW
        ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        break
      }
      case isC(ti.path): {
        if (getCountTSO1(m, ti)) {
          measureFamily(m, ti)
        }
        ti.maxW = ti.familyW || 60
        ti.maxH = ti.familyH || 30
        break
      }
    }
  })
  mG(m).forEach(g => {
    getRL(m).forEach(ri => {
      const tr = getTR(m, ri)
      const trd0 = getTRD0(m, ri)
      const trd1 = getTRD1(m, ri)
      const wr = tr.offsetW + tr.selfW + trd0.familyW + getTaskWidth(g) * hasTaskRight(m, ri)
      const wl = tr.offsetW - trd1.familyW - getTaskWidth(g) * hasTaskLeft(m, ri)
      if ((tr.offsetH + trd0.familyH / 2) > g.maxD) {g.maxD = tr.offsetH + trd0.familyH / 2}
      if ((tr.offsetH + trd1.familyH / 2) > g.maxD) {g.maxD = tr.offsetH + trd1.familyH / 2}
      if ((tr.offsetH - trd0.familyH / 2) < g.maxU) {g.maxU = tr.offsetH - trd0.familyH / 2}
      if ((tr.offsetH - trd1.familyH / 2) < g.maxU) {g.maxU = tr.offsetH - trd1.familyH / 2}
      if ((wr) > g.maxR) {g.maxR = wr}
      if ((wl) < g.maxL) {g.maxL = wl}
    })
    g.mapWidth = g.maxR + Math.abs(g.maxL) + 2 * MARGIN_X
    g.mapHeight = g.maxD - g.maxU + 2 * MARGIN_Y
  })
}
