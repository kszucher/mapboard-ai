import {getEquationDim, getTextDim} from "../components/map/MapDivUtils"
import {getCountTSCH, getCountTSCV, getG, getNodeByPath} from "../selectors/MapQueries.ts"
import {MIN_NODE_H, MIN_NODE_W, NODE_MARGIN_X_LARGE, NODE_MARGIN_X_SMALL, NODE_MARGIN_Y_LARGE, NODE_MARGIN_Y_SMALL} from "../state/Consts"
import {M, T} from "../state/MapStateTypes"
import {createArray} from "../utils/Utils"

export const measureText = (m: M, pt: T, t: T) => {
  const g = getG(m)
  if (
    t.content !== '' &&
    (
      t.dimW === 0 ||
      t.dimH === 0 ||
      (
        pt && (
          pt.content !== t.content ||
          pt.contentType !== t.contentType ||
          pt.textFontSize !== t.textFontSize
        )
      )
    )
  ) {
    if (t.contentType === 'text') {
      const dim = getTextDim(t.content, t.textFontSize)
      t.dimW = dim[0]
      t.dimH = dim[1]
    } else if (t.contentType === 'mermaid') {
      const currDiv = document.getElementById(t.nodeId) as HTMLDivElement
      if (currDiv) {
        t.dimW = currDiv.offsetWidth
        t.dimH = currDiv.offsetHeight
      }
    } else if (t.contentType === 'equation') {
      const dim = getEquationDim(t.content)
      t.dimW = dim[0]
      t.dimH = dim[1]
    }
  }
  t.selfW = (t.dimW > 20 ? t.dimW : MIN_NODE_W) + (g.density === 'large' ? NODE_MARGIN_X_LARGE : NODE_MARGIN_X_SMALL)
  t.selfH = (t.dimH / 17 > 1 ? t.dimH : MIN_NODE_H) + (g.density === 'large' ? NODE_MARGIN_Y_LARGE : NODE_MARGIN_Y_SMALL)
}

export const measureTable = (m: M, t: T) => {
  const countSCR = getCountTSCV(m, t)
  const countSCC = getCountTSCH(m, t)
  let maxCellHeightMat = createArray(countSCR, countSCC)
  let maxCellWidthMat = createArray(countSCR, countSCC)
  let isCellSpacingActivated = 0
  for (let i = 0; i < countSCR; i++) {
    for (let j = 0; j < countSCC; j++) {
      const cn = getNodeByPath(m, [...t.path, 'c', i, j]) as T
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
        maxCellHeightMat[i][j] += t.spacing
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
    t.maxRowHeight.push(maxRowHeight)
    t.sumMaxRowHeight.push(maxRowHeight + t.sumMaxRowHeight.slice(-1)[0])
    t.selfH += maxRowHeight
  }
  for (let j = 0; j < countSCC; j++) {
    let maxColWidth = 0
    for (let i = 0; i < countSCR; i++) {
      let cellWidth = maxCellWidthMat[i][j]
      if (cellWidth >= maxColWidth) {
        maxColWidth = cellWidth
      }
    }
    t.maxColWidth.push(maxColWidth)
    t.sumMaxColWidth.push(maxColWidth + t.sumMaxColWidth.slice(-1)[0])
    t.selfW += maxColWidth
  }
  for (let j = 0; j < countSCC; j++) {
    for (let i = 0; i < countSCR; i++) {
      const cn = getNodeByPath(m, [...t.path, 'c', i, j]) as T
      cn.selfW = t.maxColWidth[j]
      cn.selfH = t.maxRowHeight[i]
    }
  }
}
