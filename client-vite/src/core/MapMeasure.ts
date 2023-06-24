import {G, M, N} from "../state/MapPropTypes"
import {getNodeById, getNodeByPath, isG, isR, isD, isS, getCountSC, getCountSCR, getCountSCC, getCountR0D1S, getCountR0D0S, getCountSS, getCountD, isC, getCountSSS, getCountSSC} from "./MapUtils"
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
  let paddingW = g.padding * 2
  let paddingH = g.padding * 2
  let densityW = 0
  let densityH = 0
  if (n.contentType === 'text') {
    densityW = g.density === 'large' ? 0 : 8
    densityH = g.density === 'large' ? 1 : 2
  }
  n.selfW = (n.dimW > 20 ? n.dimW : 20) + paddingW + densityW
  n.selfH = n.dimH / 17 <= 1 ? g.defaultH + densityH : n.dimH + paddingH + densityH
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
      if (cn.maxH > g.defaultH) {
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
  const countSS = getCountSS(m, n.path)
  let sMaxW = 0
  for (let i = 0; i < countSS; i++) {
    const cn = getNodeByPath(m, [...n.path, 's', i]) as N
    n.familyH += cn.maxH
    let currMaxW = cn.maxW
    if (currMaxW >= sMaxW) {
      sMaxW = currMaxW
    }
  }
  if (getCountSSS(m, n.path) || getCountSSC(m, n.path)) {
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
        const r0 = getNodeByPath(m, ['r', 0]) as N
        const r0d0 = getNodeByPath(m, ['r', 0, 'd', 0]) as N
        const r0d1 = getNodeByPath(m, ['r', 0, 'd', 1]) as N
        const countR0D0S = getCountR0D0S(m)
        const countR0D1S = getCountR0D1S(m)
        const taskRight = m.some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 0)
        const taskLeft = m.some(n => n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4 && n.path[3] === 1)
        const leftTaskWidth = countR0D1S > 0 && taskLeft ? taskConfigWidth : 0
        const leftMapWidth = countR0D1S > 0 ? sLineDeltaXDefault + r0d1.familyW : 0
        const rightMapWidth = countR0D0S > 0 ? sLineDeltaXDefault + r0d0.familyW : 0
        const rightTaskWidth = countR0D0S > 0 && taskRight ? taskConfigWidth : 0
        const leftWidth = leftMapWidth + leftTaskWidth + margin
        const rightWidth = rightMapWidth + rightTaskWidth + margin
        let flow = 'both'
        if (countR0D0S && !countR0D1S) flow = 'right'
        if (!countR0D0S && countR0D1S) flow = 'left'
        let sumWidth = 0
        if (alignment === 'adaptive') {
          if (flow === 'right') {
            sumWidth = margin + r0.selfW + rightWidth
          } else if (flow === 'left') {
            sumWidth = leftWidth + r0.selfW + margin
          } else if (flow === 'both') {
            sumWidth = leftWidth + r0.selfW + rightWidth
          }
        } else if (alignment === 'centered') {
          sumWidth = 2 * Math.max(...[leftWidth, rightWidth]) + r0.selfW
        }
        const divMinWidth = window.screen.availWidth > 1280 ? 1280 : 800
        n.mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
        if (alignment === 'centered') {
          n.mapStartCenterX = n.mapWidth / 2
        } else if (alignment === 'adaptive') {
          if (flow === 'both') {
            let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
            n.mapStartCenterX = leftSpace + leftWidth + r0.selfW / 2
          } else if (flow === 'right') {
            n.mapStartCenterX = margin + r0.selfW / 2
          } else if (flow === 'left') {
            n.mapStartCenterX = n.mapWidth - margin - r0.selfW / 2
          }
        }
        const rightMapHeight = getCountD(m, ['r', 0]) > 0 ? r0d0.familyH : 0
        const leftMapHeight = getCountD(m, ['r', 0]) > 1 ? r0d1.familyH : 0
        n.mapHeight = Math.max(...[rightMapHeight, leftMapHeight]) + 60
        break
      }
      case isR(n.path): {
        measureText(g, pn, n)
        // TODO start here to utilize maxW and maxH
        break
      }
      case isD(n.path): {
        if (getCountSS(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW
        n.maxH = n.familyH
        break
      }
      case isS(n.path): {
        if (getCountSC(m, n.path)) {
          measureTable(m, g, n)
        } else {
          measureText(g, pn, n)
        }
        if (getCountSS(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.selfW + n.familyW
        n.maxH = Math.max(...[n.selfH, n.familyH])
        break
      }
      case isC(n.path): {
        if (getCountSS(m, n.path)) {
          measureFamily(m, g, n)
        }
        n.maxW = n.familyW
        n.maxH = n.familyH
        break
      }
    }
  })
  m.reverse()
}
