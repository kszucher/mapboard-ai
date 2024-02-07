import {M, T} from "../../state/MapStateTypes.ts"
import {mT, isR, isS, getCountTSO1, getCountTSO2, getCountTCO1, getCountTCO2, getTSO1, getTCO1, isC} from "../../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const mHashN = new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]))
  const mHashP = new Map<string, T>(m.map(ti => [ti.path.join(''), ti as T]))
  mT(m).forEach(ti => {
    ti.countTSO1 = getCountTSO1(m, ti)
    ti.countTSO2 = getCountTSO2(m, ti)
    ti.countTCO1 = getCountTCO1(m, ti)
    ti.countTCO2 = getCountTCO2(m, ti)
    ti.countTSO1 > 0 && Object.assign(ti, {tso1: getTSO1(m, ti)})
    ti.countTCO1 > 0 && Object.assign(ti, {tco1: getTCO1(m, ti)})
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        ti.tsi1 = mHashP.get(ti.path.slice(0, -2).join(''))!.nodeId
        break
      }
      case isC(ti.path): {
        ti.tsi1 = mHashP.get(ti.path.slice(0, -3).join(''))!.nodeId
        ti.tsi2 = mHashP.get(ti.path.slice(0, -5).join(''))!.nodeId
        break
      }
    }
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        const si1 = mHashN.get(ti.tsi1)!
        const i = ti.path.at(-1)
        ti.isTop = i === 0 && si1.isTop ? 1 : 0
        ti.isBottom = i === si1.countTSO1 - 1 && si1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        break
      }
    }
  })
}
