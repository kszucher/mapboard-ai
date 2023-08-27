import {getEquationDim, getTextDim} from "../component/MapDivUtils"
import {G, M, N} from "../state/MapStateTypes"
import {getCountNCO2, getCountSCH, getCountSCV, getCountNSO1, getCountNSO2, getNodeByPath} from "./MapUtils"
import {createArray} from "./Utils"

export const measureText = (g: G, pn: N, n: N) => {
  if (
    n.content !== '' &&
    (
      n.dimW === 0 ||
      n.dimH === 0 ||
      (
        pn && (
          pn.content !== n.content ||
          pn.contentType !== n.contentType ||
          pn.textFontSize !== n.textFontSize
        )
      )
    )
  ) {
    if (n.contentType === 'text') {
      const dim = getTextDim(n.content, n.textFontSize)
      n.dimW = dim[0]
      n.dimH = dim[1]
    } else if (n.contentType === 'mermaid') {
      const currDiv = document.getElementById(n.nodeId) as HTMLDivElement
      if (currDiv) {
        n.dimW = currDiv.offsetWidth
        n.dimH = currDiv.offsetHeight
      }
    } else if (n.contentType === 'equation') {
      const dim = getEquationDim(n.content)
      n.dimW = dim[0]
      n.dimH = dim[1]
    }
  }
  n.selfW = (n.dimW > 20 ? n.dimW : 20) + (g.density === 'large' ? 16 : 18)
  n.selfH = (n.dimH / 17 > 1 ? n.dimH : 20) + (g.density === 'large' ? 8 : 4)
}

export const measureTable = (m: M, g: G, n: N) => {
  const countSCR = getCountSCV(m, n.path)
  const countSCC = getCountSCH(m, n.path)
  let maxCellHeightMat = createArray(countSCR, countSCC)
  let maxCellWidthMat = createArray(countSCR, countSCC)
  let isCellSpacingActivated = 0
  for (let i = 0; i < countSCR; i++) {
    for (let j = 0; j < countSCC; j++) {
      const cn = getNodeByPath(m, [...n.path, 'c', i, j]) as N
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
        maxCellHeightMat[i][j] += n.spacing
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
    n.maxRowHeight.push(maxRowHeight)
    n.sumMaxRowHeight.push(maxRowHeight + n.sumMaxRowHeight.slice(-1)[0])
    n.selfH += maxRowHeight
  }
  for (let j = 0; j < countSCC; j++) {
    let maxColWidth = 0
    for (let i = 0; i < countSCR; i++) {
      let cellWidth = maxCellWidthMat[i][j]
      if (cellWidth >= maxColWidth) {
        maxColWidth = cellWidth
      }
      const cn = getNodeByPath(m, [...n.path, 'c', i, j, 's', 0]) as N
      if (cn && cn.taskStatus !== 0) {
        maxColWidth += 120
      }
    }
    n.maxColWidth.push(maxColWidth)
    n.sumMaxColWidth.push(maxColWidth + n.sumMaxColWidth.slice(-1)[0])
    n.selfW += maxColWidth
  }
  for (let j = 0; j < countSCC; j++) {
    for (let i = 0; i < countSCR; i++) {
      const cn = getNodeByPath(m, [...n.path, 'c', i, j]) as N
      cn.selfW = n.maxColWidth[j]
      cn.selfH = n.maxRowHeight[i]
    }
  }
}

export const measureFamily = (m: M, g: G, n: N) => {
  const countSS = getCountNSO1(m, n)
  let sMaxW = 0
  for (let i = 0; i < countSS; i++) {
    const cn = getNodeByPath(m, [...n.path, 's', i]) as N
    n.familyH += cn.maxH
    let currMaxW = cn.maxW
    if (currMaxW >= sMaxW) {
      sMaxW = currMaxW
    }
  }
  if (getCountNSO2(m, n) || getCountNCO2(m, n)) {
    n.familyH += (countSS - 1) * n.spacing
  }
  n.familyW = sMaxW + g.sLineDeltaXDefault
}
