import {M, PT, T} from "../state/MapStateTypes.ts"
import {mT, isR, isS, getCountTSO2, getCountTCO2, isC, getNodeByPath} from "../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const mHashN = new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]))
  const mHashP = new Map<string, T>(m.map(ti => [ti.path.join(''), ti as T]))

  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        ti.tsi1 = mHashP.get(ti.path.slice(0, -2).join(''))!.nodeId
        getNodeByPath(m, ti.path.slice(0, -2) as PT).tso1.push(ti.nodeId)
        break
      }
      case isC(ti.path): {
        ti.tsi1 = mHashP.get(ti.path.slice(0, -3).join(''))!.nodeId
        ti.tsi2 = mHashP.get(ti.path.slice(0, -5).join(''))!.nodeId
        getNodeByPath(m, ti.path.slice(0, -3) as PT).tco1.push(ti.nodeId)
        break
      }
    }
  })

  mT(m).forEach(ti => {
    ti.countTSO1 = ti.tso1.length
    ti.countTSO2 = ti.countTSO1 && getCountTSO2(m, ti)
    ti.countTCO1 = ti.tco1.length
    ti.countTCO2 = ti.countTCO1 && getCountTCO2(m, ti)
  })

  mT(m).forEach(ti => {
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
