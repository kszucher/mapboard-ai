import {M, PT} from "../../state/MapStateTypes.ts"
import {mT, isR, isS, isC, getCountTSO1, getCountTSO2, getCountTCO1, getCountTCO2, getTSI1, getTSO1, getTCO1, getTSI2, getNodeByPath} from "../../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.countTSO1 = getCountTSO1(m, ti)
        ti.countTSO2 = getCountTSO2(m, ti)
        ti.countTCO1 = getCountTCO1(m, ti)
        ti.countTCO2 = getCountTCO2(m, ti)
        ti.countTSO1 > 0 && Object.assign(ti, {tso1: getTSO1(m, ti)})
        ti.countTCO1 > 0 && Object.assign(ti, {tco1: getTCO1(m, ti)})
        break
      }
      case isS(ti.path): {
        ti.countTSO1 = getCountTSO1(m, ti)
        ti.countTSO2 = getCountTSO2(m, ti)
        ti.countTCO1 = getCountTCO1(m, ti)
        ti.countTCO2 = getCountTCO2(m, ti)
        ti.countTSO1 > 0 && Object.assign(ti, {tso1: getTSO1(m, ti)})
        ti.countTCO1 > 0 && Object.assign(ti, {tco1: getTCO1(m, ti)})
        ti.tsi1 = getNodeByPath(m, ti.path.slice(0, -2) as PT).nodeId

        const si1 = getTSI1(m, ti)
        const i = ti.path.at(-1)
        ti.isTop = i === 0 && si1.isTop ? 1 : 0
        ti.isBottom = i === si1.countTSO1 - 1 && si1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        ti.countTSO1 = getCountTSO1(m, ti)
        ti.countTSO2 = getCountTSO2(m, ti)
        ti.countTCO1 = getCountTCO1(m, ti)
        ti.countTCO2 = getCountTCO2(m, ti)
        ti.countTSO1 > 0 && Object.assign(ti, {tso1: getTSO1(m, ti)})
        ti.countTCO1 > 0 && Object.assign(ti, {tco1: getTCO1(m, ti)})
        ti.tsi1 = getTSI1(m, ti).nodeId
        ti.tsi2 = getTSI2(m, ti).nodeId

        break
      }
    }
  })
}
