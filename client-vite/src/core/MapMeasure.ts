import {G, M, N} from "../state/MapPropTypes"
import {getNodeById, getNodeByPath, isG, isR, isD, isS, getCountCO1, getCountSCR, getCountSCC, getCountRXD1S, getCountRXD0S, getCountSO1, getCountD, isC, getCountSO2, getCountCO2, getXRi, getRi} from "./MapUtils"
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
        const {alignment, taskConfigWidth, margin, sLineDeltaXDefault} = g
        const ri = 0 //getRi(n.path) // TODO we will need to iterate through all r-s here later
        const rx = getNodeByPath(m, ['r', ri]) as N
        const rxd0 = getNodeByPath(m, ['r', ri, 'd', 0]) as N
        const rxd1 = getNodeByPath(m, ['r', ri, 'd', 1]) as N
        const countRXD0S = getCountRXD0S(m, getXRi(m))
        const countRXD1S = getCountRXD1S(m, getXRi(m))
        const taskRight = m.some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 0)
        const taskLeft = m.some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 1)
        const leftTaskWidth = countRXD1S > 0 && taskLeft ? taskConfigWidth : 0
        const leftMapWidth = countRXD1S > 0 ? sLineDeltaXDefault + rxd1.familyW : 0
        const rightMapWidth = countRXD0S > 0 ? sLineDeltaXDefault + rxd0.familyW : 0
        const rightTaskWidth = countRXD0S > 0 && taskRight ? taskConfigWidth : 0
        const leftWidth = leftMapWidth + leftTaskWidth + margin
        const rightWidth = rightMapWidth + rightTaskWidth + margin
        let flow = 'both'
        if (countRXD0S && !countRXD1S) flow = 'right'
        if (!countRXD0S && countRXD1S) flow = 'left'
        let sumWidth = 0
        if (alignment === 'adaptive') {
          if (flow === 'right') {
            sumWidth = margin + rx.selfW + rightWidth
          } else if (flow === 'left') {
            sumWidth = leftWidth + rx.selfW + margin
          } else if (flow === 'both') {
            sumWidth = leftWidth + rx.selfW + rightWidth
          }
        } else if (alignment === 'centered') {
          sumWidth = 2 * Math.max(...[leftWidth, rightWidth]) + rx.selfW
        }
        const divMinWidth = window.screen.availWidth > 400 ? 400 : 400
        n.mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
        if (alignment === 'centered') {
          n.mapStartCenterX = n.mapWidth / 2
        } else if (alignment === 'adaptive') {
          if (flow === 'both') {
            let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
            n.mapStartCenterX = leftSpace + leftWidth + rx.selfW / 2
          } else if (flow === 'right') {
            n.mapStartCenterX = margin + rx.selfW / 2
          } else if (flow === 'left') {
            n.mapStartCenterX = n.mapWidth - margin - rx.selfW / 2
          }
        }
        const rightMapHeight = getCountD(m, ['r', ri]) > 0 ? rxd0.familyH : 0
        const leftMapHeight = getCountD(m, ['r', ri]) > 1 ? rxd1.familyH : 0
        n.mapHeight = Math.max(...[rightMapHeight, leftMapHeight]) + 150
        break
      }
      case isR(n.path): {
        measureText(g, pn, n)
        // TODO start here to utilize maxW and maxH
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
