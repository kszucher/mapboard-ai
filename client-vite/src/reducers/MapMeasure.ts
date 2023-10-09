import {M} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"
import {getCountTCO1, getNodeById, isC, isD, isR, isS, getCountTSO1, mT, getG, getBlockDimensions, mTR} from "../selectors/MapSelector"

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
  const {blockR, blockL, blockD, blockU, blockW, blockH} = getBlockDimensions(m)
  Object.assign(getG(m), {maxR: blockR, maxL: blockL, maxD: blockD, maxU: blockU, mapWidth: blockW, mapHeight: blockH})
}
