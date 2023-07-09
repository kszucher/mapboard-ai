import {G, M, N} from "../state/MapPropTypes"
import {getNodeById, getNodeByPath, isG, isR, isD, isS, getCountCO1, getCountSCR, getCountSCC, getCountSO1, isC, getCountSO2, getCountCO2, getRL, getRi} from "./MapUtils"
import {getEquationDim, getTextDim} from "../component/MapDivUtils"
import {createArray} from "./Utils"

const measureText = (g: G, pn: N, n: N) => {
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
    } else if (n.contentType === 'equation') {
      const dim = getEquationDim(n.content)
      n.dimW = dim[0]
      n.dimH = dim[1]
    }
  }
  n.selfW = (n.dimW > 20 ? n.dimW : 20) + (g.density === 'large' ? 16 : 18)
  n.selfH = (n.dimH / 17 > 1 ? n.dimH : 20) + (g.density === 'large' ? 8 : 4)
}

const measureTable = (m: M, g: G, n: N) => {
  const countSCR = getCountSCR(m, n.path)
  const countSCC = getCountSCC(m, n.path)
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

const measureFamily = (m: M, g: G, n: N) => {
  const countSS = getCountSO1(m, n.path)
  let sMaxW = 0
  for (let i = 0; i < countSS; i++) {
    const cn = getNodeByPath(m, [...n.path, 's', i]) as N
    n.familyH += cn.maxH
    let currMaxW = cn.maxW
    if (currMaxW >= sMaxW) {
      sMaxW = currMaxW
    }
  }
  if (getCountSO2(m, n.path) || getCountCO2(m, n.path)) {
    n.familyH += (countSS - 1)*n.spacing
  }
  n.familyW = sMaxW + g.sLineDeltaXDefault
}

export const mapMeasure = (pm: M, m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  m.reverse()
  m.forEach(n => {
    const pn = getNodeById(pm, n.nodeId)
    switch (true) {
      case isG(n.path): {
        getRL(m).forEach(r => {
          const ri = getRi(r.path)
          const rx = getNodeByPath(m, ['r', ri]) as N
          const rxd0 = getNodeByPath(m, ['r', ri, 'd', 0]) as N
          const rxd1 = getNodeByPath(m, ['r', ri, 'd', 1]) as N
          if ((rx.offsetH + rxd0.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rxd0.familyH / 2}
          if ((rx.offsetH + rxd1.familyH / 2) > n.maxD) {n.maxD = rx.offsetH + rxd1.familyH / 2}
          if ((rx.offsetH - rxd0.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rxd0.familyH / 2}
          if ((rx.offsetH - rxd1.familyH / 2) < n.maxU) {n.maxU = rx.offsetH - rxd1.familyH / 2}
          if ((rx.offsetW + rx.selfW / 2 + rxd0.familyW) > n.maxR) {n.maxR = rx.offsetW + rx.selfW / 2 + rxd0.familyW}
          if ((rx.offsetW - rx.selfW / 2 - rxd1.familyW) < n.maxL) {n.maxL = rx.offsetW - rx.selfW / 2 - rxd1.familyW}
        })
        n.mapWidth = n.maxR - n.maxL + n.margin * 2 // if task exists on left, +150, if task exists on the right, another +150
        n.mapHeight = n.maxD - n.maxU
        break
      }
      case isR(n.path): {
        measureText(g, pn, n)
        break
      }
      case isD(n.path): {
        if (getCountSO1(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW
        n.maxH = n.familyH
        break
      }
      case isS(n.path): {
        if (getCountCO1(m, n.path)) {
          measureTable(m, g, n)
        } else {
          measureText(g, pn, n)
        }
        if (getCountSO1(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.selfW + n.familyW
        n.maxH = Math.max(...[n.selfH, n.familyH])
        break
      }
      case isC(n.path): {
        if (getCountSO1(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW || 60
        n.maxH = n.familyH || 30
        break
      }
    }
  })
  m.reverse()
}
