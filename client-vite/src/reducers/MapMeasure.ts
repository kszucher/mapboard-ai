import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTCO2, getCountTSO1, getCountTSO2, getG, getNodeById, getNodeByPath, hasTask, isG, isR, isS, isC, mGT, mTR} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X, MARGIN_Y} from "../state/Consts"
import {PlaceType} from "../state/Enums.ts"
import {M, T} from "../state/MapStateTypes"
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
        if (getCountTSO1(m, ti)) {
          const countSS = getCountTSO1(m, ti)
          ti.familyW = 0
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            if (cn.maxW >= ti.familyW) {
              ti.familyW = cn.maxW
            }
          }
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            ti.familyH += cn.maxH
          }
          if (getCountTSO2(m, ti) || getCountTCO2(m, ti)) {
            ti.familyH += (countSS - 1) * ti.spacing
          }
        }
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
        if (getCountTSO1(m, ti)) {
          const g = getG(m)
          const countSS = getCountTSO1(m, ti)
          ti.familyW = 0
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            if (cn.maxW >= ti.familyW) {
              ti.familyW = cn.maxW
            }
          }
          if ( PlaceType.EXPLODED) {
            ti.familyW += g.sLineDeltaXDefault
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.familyW += INDENT
          }
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            ti.familyH += cn.maxH
          }
          if (getCountTSO2(m, ti) || getCountTCO2(m, ti)) {
            ti.familyH += (countSS - 1) * ti.spacing
          }
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
          const g = getG(m)
          const countSS = getCountTSO1(m, ti)
          ti.familyW = 0
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            if (cn.maxW >= ti.familyW) {
              ti.familyW = cn.maxW
            }
          }
          if ( PlaceType.EXPLODED) {
            ti.familyW += g.sLineDeltaXDefault
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.familyW += INDENT
          }
          for (let i = 0; i < countSS; i++) {
            const cn = getNodeByPath(m, [...ti.path, 's', i]) as T
            ti.familyH += cn.maxH
          }
          if (getCountTSO2(m, ti) || getCountTCO2(m, ti)) {
            ti.familyH += (countSS - 1) * ti.spacing
          }
        }
        ti.maxW = ti.familyW || 60
        ti.maxH = ti.familyH || 30
        break
      }
    }
  })
}
