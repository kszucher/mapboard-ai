import {getEquationDim, getTextDim} from "../components/map/MapDivUtils.ts"
import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTCO2, getCountTSO1, getCountTSO2, getG, getNodeById, hasTask, isG, isR, isS, isC, mGT, mTR, getTSO1, getTCV, getTCH, getTCO1, getPrefixTCV, getPrefixTCH, getTCO1R0, getTCO1C0,} from "../selectors/MapQueries.ts"
import {CELL_SPACING, INDENT, MARGIN_X, MARGIN_Y, MIN_NODE_H, MIN_NODE_W, NODE_MARGIN_X_LARGE, NODE_MARGIN_X_SMALL, NODE_MARGIN_Y_LARGE, NODE_MARGIN_Y_SMALL} from "../state/Consts"
import {PlaceType} from "../state/Enums.ts"
import {M} from "../state/MapStateTypes"

export const mapMeasure = (pm: M, m: M) => {
  const g = getG(m)
  const minOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  mTR(m).map(el => el.offsetW -= minOffsetW)
  mTR(m).map(el => el.offsetH -= minOffsetH)
  mGT(m).slice().reverse().forEach(ti => {
    switch (true) {
      case isG(ti.path): {
        ti.selfW = Math.max(...mTR(m).map(ri => ri.offsetW + ri.maxW))
        ti.selfH = Math.max(...mTR(m).map(ri => ri.offsetH + ri.maxH))
        break
      }
      case isR(ti.path): {
        const countTSO1 = getCountTSO1(m, ti)
        if (countTSO1) {
          ti.familyW = Math.max(...getTSO1(m, ti).map(ti => ti.maxW))
          ti.familyH = getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * +Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
        }
        ti.selfW = ti.familyW + 2 * MARGIN_X + getTaskWidth(getG(m)) * hasTask(m, ti)
        ti.selfH = ti.familyH + 2 * MARGIN_Y
        ti.maxW = ti.selfW
        ti.maxH = ti.selfH
        break
      }
      case isS(ti.path): {
        if (getCountTCO1(m, ti)) {
          const tco1 = getTCO1(m, ti)
          tco1.map(ti => Object.assign(ti, {selfW: Math.max(...getTCH(m, ti).map(ti => ti.familyW + CELL_SPACING))}))
          tco1.map(ti => Object.assign(ti, {selfH: Math.max(...getTCV(m, ti).map(ti => ti.familyH + CELL_SPACING))}))
          tco1.map(ti => Object.assign(ti, {calcOffsetX: getPrefixTCV(m, ti).reduce((a, b) => a + b.selfW, 0)}))
          tco1.map(ti => Object.assign(ti, {calcOffsetY: getPrefixTCH(m, ti).reduce((a, b) => a + b.selfH, 0)}))
          ti.selfW = getTCO1R0(m, ti).reduce((a, b) => a + b.selfW, 0)
          ti.selfH = getTCO1C0(m, ti).reduce((a, b) => a + b.selfH, 0)
        } else {
          const g = getG(m)
          const pti = getNodeById(pm, ti.nodeId)
          if (
            ti.content !== '' &&
            (
              ti.dimW === 0 ||
              ti.dimH === 0 ||
              (
                pti && (
                  pti.content !== ti.content ||
                  pti.contentType !== ti.contentType ||
                  pti.textFontSize !== ti.textFontSize
                )
              )
            )
          ) {
            if (ti.contentType === 'text') {
              const dim = getTextDim(ti.content, ti.textFontSize)
              ti.dimW = dim[0]
              ti.dimH = dim[1]
            } else if (ti.contentType === 'mermaid') {
              const currDiv = document.getElementById(ti.nodeId) as HTMLDivElement
              if (currDiv) {
                ti.dimW = currDiv.offsetWidth
                ti.dimH = currDiv.offsetHeight
              }
            } else if (ti.contentType === 'equation') {
              const dim = getEquationDim(ti.content)
              ti.dimW = dim[0]
              ti.dimH = dim[1]
            }
          }
          ti.selfW = (ti.dimW > 20 ? ti.dimW : MIN_NODE_W) + (g.density === 'large' ? NODE_MARGIN_X_LARGE : NODE_MARGIN_X_SMALL)
          ti.selfH = (ti.dimH / 17 > 1 ? ti.dimH : MIN_NODE_H) + (g.density === 'large' ? NODE_MARGIN_Y_LARGE : NODE_MARGIN_Y_SMALL)
        }
        const countTSO1 = getCountTSO1(m, ti)
        if (countTSO1) {
          ti.familyW = Math.max(...getTSO1(m, ti).map(ti => ti.maxW))
          ti.familyH = getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * +Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
          if (g.placeType === PlaceType.EXPLODED) {
            ti.familyW += g.sLineDeltaXDefault
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.familyW += INDENT
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
        const countTSO1 = getCountTSO1(m, ti)
        if (countTSO1) {
          ti.familyW = Math.max(...getTSO1(m, ti).map(ti => ti.maxW))
          ti.familyH = getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * +Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
          if (g.placeType === PlaceType.EXPLODED) {
            ti.familyW += g.sLineDeltaXDefault
          } else if (g.placeType === PlaceType.INDENTED) {
            ti.familyW += INDENT
          }
        } else {
          ti.familyW = 60
          ti.familyH = 30
        }
        break
      }
    }
  })
}
