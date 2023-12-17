import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTSO1, getG, getNodeById, hasTask, isC, isR, isS, mT, mTR} from "../selectors/MapSelector"
import {MARGIN_X, MARGIN_Y} from "../state/Consts"
import {PlaceTypes} from "../state/Enums.ts"
import {M} from "../state/MapStateTypes"
import {measureFamily, measureTable, measureText} from "./MapMeasureUtils"

export const mapMeasure = (pm: M, m: M) => {
  const g = getG(m)
  mT(m).slice().reverse().forEach(ti => {
    const pt = getNodeById(pm, ti.nodeId)
    switch (true) {
      case isR(ti.path): {
        if (getCountTSO1(m, ti)) {
          measureFamily(m, ti)
        }
        ti.selfW = ti.familyW + 2 * MARGIN_X
        ti.selfH = ti.familyH + 2 * MARGIN_Y
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
        if (g.placeType === PlaceTypes.EXPLODED) {
          ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        } else if (g.placeType === PlaceTypes.INDENTED) {
          ti.maxH = ti.selfH + ti.familyH
        }
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
