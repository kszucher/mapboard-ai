import {getTaskWidth} from "../components/MapSvgUtils";
import {MARGIN_X, MARGIN_Y} from "../state/Consts";
import {G, M, N} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils";
import {getCountNCO1, getNodeById, getNodeByPath, getRi, getRL, isC, isD, isG, isR, isS, hasTaskLeft, hasTaskRight, getCountNSO1, getNRD1, getNRD0, getNR} from "../selectors/MapSelectorUtils"

export const mapMeasure = (pm: M, m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  m.reverse()
  m.forEach(n => {
    const pn = getNodeById(pm, n.nodeId)
    switch (true) {
      case isG(n.path): {
        getRL(m).forEach(r => {
          const nr = getNR(m, r) as N
          const nrd0 = getNRD0(m, r) as N
          const nrd1 = getNRD1(m, r) as N
          const wr = nr.offsetW + nr.selfW + nrd0.familyW + getTaskWidth(n) * hasTaskRight(m, getRi(r.path))
          const wl = nr.offsetW - nrd1.familyW - getTaskWidth(n) * hasTaskLeft(m, getRi(r.path))
          if ((nr.offsetH + nrd0.familyH / 2) > n.maxD) {n.maxD = nr.offsetH + nrd0.familyH / 2}
          if ((nr.offsetH + nrd1.familyH / 2) > n.maxD) {n.maxD = nr.offsetH + nrd1.familyH / 2}
          if ((nr.offsetH - nrd0.familyH / 2) < n.maxU) {n.maxU = nr.offsetH - nrd0.familyH / 2}
          if ((nr.offsetH - nrd1.familyH / 2) < n.maxU) {n.maxU = nr.offsetH - nrd1.familyH / 2}
          if ((wr) > n.maxR) {n.maxR = wr}
          if ((wl) < n.maxL) {n.maxL = wl}
        })
        n.mapWidth = n.maxR + Math.abs(n.maxL) + 2 * MARGIN_X
        n.mapHeight = n.maxD - n.maxU + 2 * MARGIN_Y
        break
      }
      case isR(n.path): {
        measureText(g, pn, n)
        break
      }
      case isD(n.path): {
        if (getCountNSO1(m, n)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW
        n.maxH = n.familyH
        break
      }
      case isS(n.path): {
        if (getCountNCO1(m, n)) {
          measureTable(m, g, n)
        } else {
          measureText(g, pn, n)
        }
        if (getCountNSO1(m, n)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.selfW + n.familyW
        n.maxH = Math.max(...[n.selfH, n.familyH])
        break
      }
      case isC(n.path): {
        if (getCountNSO1(m, n)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW || 60
        n.maxH = n.familyH || 30
        break
      }
    }
  })
  m.reverse()
}
