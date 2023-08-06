import {MARGIN_X, MARGIN_Y} from "../state/Consts";
import {G, M, N} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils";
import {getCountCO1, getCountSO1, getNodeById, getNodeByPath, getRi, getRL, isC, isD, isG, isR, isS, hasTaskLeft, hasTaskRight, getTaskWidth} from "./MapUtils"

export const mapMeasure = (pm: M, m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  m.reverse()
  m.forEach(n => {
    const pn = getNodeById(pm, n.nodeId)
    switch (true) {
      case isG(n.path): {
        getRL(m).forEach(r => {
          const ri = getRi(r.path)
          const rx = getNodeByPath(m, ['r', ri]) as N
          const rid0 = getNodeByPath(m, ['r', ri, 'd', 0]) as N
          const rid1 = getNodeByPath(m, ['r', ri, 'd', 1]) as N
          const wr = rx.offsetW + rx.selfW + rid0.familyW + getTaskWidth(n) * hasTaskRight(m, getRi(r.path))
          const wl = rx.offsetW - rid1.familyW - getTaskWidth(n) * hasTaskLeft(m, getRi(r.path))
          if ((rx.offsetH + rid0.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rid0.familyH / 2}
          if ((rx.offsetH + rid1.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rid1.familyH / 2}
          if ((rx.offsetH - rid0.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rid0.familyH / 2}
          if ((rx.offsetH - rid1.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rid1.familyH / 2}
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
        if (getCountSO1(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW
        n.maxH = n.familyH
        break
      }
      case isS(n.path): {
        if (getCountCO1(m, n.path)) {
          measureTable(m, g, n)
        } else {
          measureText(g, pn, n)
        }
        if (getCountSO1(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.selfW + n.familyW
        n.maxH = Math.max(...[n.selfH, n.familyH])
        break
      }
      case isC(n.path): {
        if (getCountSO1(m, n.path)) {
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
