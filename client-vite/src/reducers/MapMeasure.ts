import {getTaskWidth} from "../components/map/MapSvgUtils"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {M} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"
import {getCountTCO1, getNodeById, isC, isR, isS, getCountTSO1, mT, getG, mTR, hasTask} from "../selectors/MapSelector"

export const mapMeasure = (pm: M, m: M) => {
  mT(m).slice().reverse().forEach(ti => {
    const pt = getNodeById(pm, ti.nodeId)
    switch (true) {
      case isR(ti.path): {
        if (getCountTSO1(m, ti)) {
          measureFamily(m, ti)
        }
        ti.maxW = ti.selfW + ti.familyW
        ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        ti.selfW = ti.maxW + 2 * MARGIN_X
        ti.selfH = ti.maxH + 2 * MARGIN_Y
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
  const mapWidth = Math.max(...mTR(m).map(ri => ri.offsetW + getTaskWidth(getG(m)) * hasTask(m, ri) + ri.selfW))
  const mapHeight = Math.max(...mTR(m).map(ri => ri.offsetH + Math.max(...[ri.selfH, ri.familyH])))
  Object.assign(getG(m), {mapWidth, mapHeight})
}
