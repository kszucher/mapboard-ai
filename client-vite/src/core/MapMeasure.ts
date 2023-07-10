import {G, M, N} from "../state/MapPropTypes"
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
          const rxd0 = getNodeByPath(m, ['r', ri, 'd', 0]) as N
          const rxd1 = getNodeByPath(m, ['r', ri, 'd', 1]) as N
          if ((rx.offsetH + rxd0.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rxd0.familyH / 2}
          if ((rx.offsetH + rxd1.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rxd1.familyH / 2}
          if ((rx.offsetH - rxd0.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rxd0.familyH / 2}
          if ((rx.offsetH - rxd1.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rxd1.familyH / 2}
          if ((rx.offsetW + rx.selfW / 2 + rxd0.familyW) > n.maxR) {n.maxR = rx.offsetW + rx.selfW / 2 + rxd0.familyW}
          if ((rx.offsetW - rx.selfW / 2 - rxd1.familyW) < n.maxL) {n.maxL = rx.offsetW - rx.selfW / 2 - rxd1.familyW}
        })
        n.mapWidth = n.maxR - n.maxL + getTaskWidth(n) * (+hasTaskLeft(m) + +hasTaskRight(m)) + 100
        n.mapHeight = n.maxD - n.maxU + 100
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
