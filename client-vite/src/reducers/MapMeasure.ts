import {getTaskWidth} from "../components/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {M, T} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"
import {getCountTCO1, getNodeById, getRL, isC, isD, isR, isS, hasTaskLeft, hasTaskRight, getCountTSO1, getTRD1, getTRD0, getTR, mT, mG} from "../selectors/MapSelector"

export const mapMeasure = (pm: M, m: M) => {
  mT(m).toReversed().forEach(t => {
    const pt = getNodeById(pm, t.nodeId)
    switch (true) {
      case isR(t.path): {
        measureText(m, pt, t)
        break
      }
      case isD(t.path): {
        if (getCountTSO1(m, t)) {
          measureFamily(m, t)
        }
        t.maxW = t.familyW
        t.maxH = t.familyH
        break
      }
      case isS(t.path): {
        if (getCountTCO1(m, t)) {
          measureTable(m, t)
        } else {
          measureText(m, pt, t)
        }
        if (getCountTSO1(m, t)) {
          measureFamily(m, t)
        }
        t.maxW = t.selfW + t.familyW
        t.maxH = Math.max(...[t.selfH, t.familyH])
        break
      }
      case isC(t.path): {
        if (getCountTSO1(m, t)) {
          measureFamily(m, t)
        }
        t.maxW = t.familyW || 60
        t.maxH = t.familyH || 30
        break
      }
    }
  })
  mG(m).forEach(g => {
    getRL(m).forEach(r => {
      const nr = getTR(m, r) as T
      const nrd0 = getTRD0(m, r) as T
      const nrd1 = getTRD1(m, r) as T
      const wr = nr.offsetW + nr.selfW + nrd0.familyW + getTaskWidth(g) * hasTaskRight(m, r)
      const wl = nr.offsetW - nrd1.familyW - getTaskWidth(g) * hasTaskLeft(m, r)
      if ((nr.offsetH + nrd0.familyH / 2) > g.maxD) {g.maxD = nr.offsetH + nrd0.familyH / 2}
      if ((nr.offsetH + nrd1.familyH / 2) > g.maxD) {g.maxD = nr.offsetH + nrd1.familyH / 2}
      if ((nr.offsetH - nrd0.familyH / 2) < g.maxU) {g.maxU = nr.offsetH - nrd0.familyH / 2}
      if ((nr.offsetH - nrd1.familyH / 2) < g.maxU) {g.maxU = nr.offsetH - nrd1.familyH / 2}
      if ((wr) > g.maxR) {g.maxR = wr}
      if ((wl) < g.maxL) {g.maxL = wl}
    })
    g.mapWidth = g.maxR + Math.abs(g.maxL) + 2 * MARGIN_X
    g.mapHeight = g.maxD - g.maxU + 2 * MARGIN_Y
  })
}
