import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTSO1, getG, getNodeById, hasTask, isC, isR, isS, mT, mTR} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X, MARGIN_Y} from "../state/Consts"
import {PlaceType} from "../state/Enums.ts"
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
        if (g.placeType === PlaceType.EXPLODED) {
          ti.selfW = ti.familyW  + 2 * MARGIN_X + getTaskWidth(getG(m)) * hasTask(m, ti)
          ti.selfH = ti.familyH + 2 * MARGIN_Y
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.selfW = ti.familyW - INDENT + 2 * MARGIN_X + getTaskWidth(getG(m)) * hasTask(m, ti)
          ti.selfH = ti.familyH + 2 * MARGIN_Y
        }
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
        if (g.placeType === PlaceType.EXPLODED) {
          ti.maxW = ti.selfW + ti.familyW
          ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.maxW = Math.max(...[ti.selfW, ti.familyW])
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
  const mapWidth = Math.max(...mTR(m).map(ri => ri.offsetW + ri.selfW))
  const mapHeight = Math.max(...mTR(m).map(ri => ri.offsetH + Math.max(...[ri.selfH, ri.familyH])))
  Object.assign(getG(m), {mapWidth, mapHeight})
}
