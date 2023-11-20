import {getTaskWidth} from "../components/map/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {M} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"
import {getCountTCO1, getNodeById, isC, isD, isR, isS, getCountTSO1, mT, getG, mTR, getTRD0, getTRD1, hasTaskRight, hasTaskLeft} from "../selectors/MapSelector"

export const mapMeasure = (pm: M, m: M) => {
  mT(m).slice().reverse().forEach(ti => {
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
  const minOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  mTR(m).map(el => el.offsetW -= minOffsetW)
  mTR(m).map(el => el.offsetH -= minOffsetH)
  const mapWidth = Math.max(...mTR(m).map(ri =>
    ri.offsetW +
    getTaskWidth(getG(m)) * hasTaskRight(m, ri) +
    getTaskWidth(getG(m)) * hasTaskLeft(m, ri) +
    getTRD0(m, ri).familyW +
    getTRD1(m, ri).familyW +
    MARGIN_X * 2 +
    ri.selfW
  ))
  const mapHeight = Math.max(...mTR(m).map(ri =>
    ri.offsetH +
    Math.max(...[ri.selfH, getTRD0(m, ri).familyH, getTRD1(m, ri).familyH]) +
    MARGIN_Y * 2
  ))
  Object.assign(getG(m), {mapWidth, mapHeight})
}
