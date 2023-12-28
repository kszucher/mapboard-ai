import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTCO2, getCountTSO1, getCountTSO2, getG, getNodeById, hasTask, isG, isR, isS, isC, mGT, mTR, getTSO1} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X, MARGIN_Y} from "../state/Consts"
import {PlaceType} from "../state/Enums.ts"
import {M} from "../state/MapStateTypes"
import {measureTable, measureText} from "./MapMeasureUtils"

export const mapMeasure = (pm: M, m: M) => {
  const g = getG(m)
  const minOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  mTR(m).map(el => el.offsetW -= minOffsetW)
  mTR(m).map(el => el.offsetH -= minOffsetH)
  mGT(m).slice().reverse().forEach(ti => {
    const pti = getNodeById(pm, ti.nodeId)
    switch (true) {
      case isG(ti.path): {
        ti.maxW = Math.max(...mTR(m).map(ri => ri.offsetW + ri.maxW))
        ti.maxH = Math.max(...mTR(m).map(ri => ri.offsetH + ri.maxH))
        break
      }
      case isR(ti.path): {
        const countTSO1 = getCountTSO1(m, ti)
        ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ti => ti.maxW))
        ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ((getCountTSO2(m, ti) || getCountTCO2(m, ti)) ? (countTSO1 - 1) * ti.spacing : 0)
        ti.selfW = ti.familyW + 2 * MARGIN_X + getTaskWidth(getG(m)) * hasTask(m, ti)
        ti.selfH = ti.familyH + 2 * MARGIN_Y
        ti.maxW = ti.selfW
        ti.maxH = ti.selfH
        break
      }
      case isS(ti.path): {
        if (getCountTCO1(m, ti)) {
          measureTable(m, ti)
        } else {
          measureText(m, pti, ti)
        }
        const countTSO1 = getCountTSO1(m, ti)
        if (g.placeType === PlaceType.EXPLODED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + g.sLineDeltaXDefault
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ((getCountTSO2(m, ti) || getCountTCO2(m, ti)) ? (countTSO1 - 1) * ti.spacing : 0)
          ti.maxW = ti.selfW + ti.familyW
          ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + INDENT
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ((getCountTSO2(m, ti) || getCountTCO2(m, ti)) ? (countTSO1 - 1) * ti.spacing : 0)
          ti.maxW = Math.max(...[ti.selfW, ti.familyW])
          ti.maxH = ti.selfH + ti.familyH
        }
        break
      }
      case isC(ti.path): {
        const countTSO1 = getCountTSO1(m, ti)
        if (g.placeType === PlaceType.EXPLODED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + g.sLineDeltaXDefault
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ((getCountTSO2(m, ti) || getCountTCO2(m, ti)) ? (countTSO1 - 1) * ti.spacing : 0)
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + INDENT
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ((getCountTSO2(m, ti) || getCountTCO2(m, ti)) ? (countTSO1 - 1) * ti.spacing : 0)
        }
        ti.maxW = ti.familyW || 60
        ti.maxH = ti.familyH || 30
        break
      }
    }
  })
}
