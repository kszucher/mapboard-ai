import {getEquationDim, getTextDim} from "../components/map/MapDivUtils.ts"
import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getCountTCO1, getCountTCO2, getCountTSO1, getCountTSO2, getG, getNodeById, hasTask, isG, isR, isS, isC, mGT, mTR, getTSO1, getCountTSCV, getCountTSCH, getNodeByPath} from "../selectors/MapQueries.ts"
import {INDENT, MARGIN_X, MARGIN_Y, MIN_NODE_H, MIN_NODE_W, NODE_MARGIN_X_LARGE, NODE_MARGIN_X_SMALL, NODE_MARGIN_Y_LARGE, NODE_MARGIN_Y_SMALL} from "../state/Consts"
import {PlaceType} from "../state/Enums.ts"
import {M, T} from "../state/MapStateTypes"
import {createArray} from "../utils/Utils.ts"

export const mapMeasure = (pm: M, m: M) => {
  const g = getG(m)
  const minOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  mTR(m).map(el => el.offsetW -= minOffsetW)
  mTR(m).map(el => el.offsetH -= minOffsetH)
  mGT(m).slice().reverse().forEach(ti => {
    switch (true) {
      case isG(ti.path): {
        ti.maxW = Math.max(...mTR(m).map(ri => ri.offsetW + ri.maxW))
        ti.maxH = Math.max(...mTR(m).map(ri => ri.offsetH + ri.maxH))
        break
      }
      case isR(ti.path): {
        const countTSO1 = getCountTSO1(m, ti)
        ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ti => ti.maxW))
        ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * + Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
        ti.selfW = ti.familyW + 2 * MARGIN_X + getTaskWidth(getG(m)) * hasTask(m, ti)
        ti.selfH = ti.familyH + 2 * MARGIN_Y
        ti.maxW = ti.selfW
        ti.maxH = ti.selfH
        break
      }
      case isS(ti.path): {
        if (getCountTCO1(m, ti)) {
          const countSCR = getCountTSCV(m, ti)
          const countSCC = getCountTSCH(m, ti)
          let maxCellHeightMat = createArray(countSCR, countSCC)
          let maxCellWidthMat = createArray(countSCR, countSCC)
          let isCellSpacingActivated = 0
          for (let i = 0; i < countSCR; i++) {
            for (let j = 0; j < countSCC; j++) {
              const cn = getNodeByPath(m, [...ti.path, 'c', i, j]) as T
              maxCellHeightMat[i][j] = cn.maxH
              maxCellWidthMat[i][j] = cn.maxW
              if (cn.maxH > 20) {
                isCellSpacingActivated = 1
              }
            }
          }
          if (isCellSpacingActivated === 1) {
            for (let i = 0; i < countSCR; i++) {
              for (let j = 0; j < countSCC; j++) {
                maxCellHeightMat[i][j] += ti.spacing
              }
            }
          }
          for (let i = 0; i < countSCR; i++) {
            let maxRowHeight = 0
            for (let j = 0; j < countSCC; j++) {
              let cellHeight = maxCellHeightMat[i][j]
              if (cellHeight >= maxRowHeight) {
                maxRowHeight = cellHeight
              }
            }
            ti.maxRowHeight.push(maxRowHeight)
            ti.sumMaxRowHeight.push(maxRowHeight + ti.sumMaxRowHeight.slice(-1)[0])
            ti.selfH += maxRowHeight
          }
          for (let j = 0; j < countSCC; j++) {
            let maxColWidth = 0
            for (let i = 0; i < countSCR; i++) {
              let cellWidth = maxCellWidthMat[i][j]
              if (cellWidth >= maxColWidth) {
                maxColWidth = cellWidth
              }
            }
            ti.maxColWidth.push(maxColWidth)
            ti.sumMaxColWidth.push(maxColWidth + ti.sumMaxColWidth.slice(-1)[0])
            ti.selfW += maxColWidth
          }
          for (let j = 0; j < countSCC; j++) {
            for (let i = 0; i < countSCR; i++) {
              const cn = getNodeByPath(m, [...ti.path, 'c', i, j]) as T
              cn.selfW = ti.maxColWidth[j]
              cn.selfH = ti.maxRowHeight[i]
            }
          }
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
        if (g.placeType === PlaceType.EXPLODED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + g.sLineDeltaXDefault
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * + Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
          ti.maxW = ti.selfW + ti.familyW
          ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + INDENT
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * + Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
          ti.maxW = Math.max(...[ti.selfW, ti.familyW])
          ti.maxH = ti.selfH + ti.familyH
        }
        break
      }
      case isC(ti.path): {
        const countTSO1 = getCountTSO1(m, ti)
        if (g.placeType === PlaceType.EXPLODED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + g.sLineDeltaXDefault
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * + Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
        } else if (g.placeType === PlaceType.INDENTED) {
          ti.familyW = countTSO1 && Math.max(...getTSO1(m, ti).map(ri => ri.maxW)) + INDENT
          ti.familyH = countTSO1 && getTSO1(m, ti).reduce((a, b) => a + b.maxH, 0) + ti.spacing * (countTSO1 - 1) * + Boolean((getCountTSO2(m, ti) || getCountTCO2(m, ti)))
        }
        ti.maxW = ti.familyW || 60
        ti.maxH = ti.familyH || 30
        break
      }
    }
  })
}
