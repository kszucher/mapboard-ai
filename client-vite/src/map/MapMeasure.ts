import {createArray} from "../core/Utils"
import {getEquationDim, getTextDim} from "../component/MapDivUtils"
import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapMeasure = {
  start: (m: M) => {
    mapMeasure.iterate(m, m.r[0], {
      hasMultipleChild: 0,
      hasMultipleContentRow: 0,
    })
  },

  iterate: (m: M, n: N, params: { hasMultipleChild: number, hasMultipleContentRow: number }) => {
    params.hasMultipleChild = 0
    params.hasMultipleContentRow = 0
    let dCount = Object.keys(n.d).length
    for (let i = 0; i < dCount; i++) {
      mapMeasure.iterate(m, n.d[i], params)
    }
    let sCount = Object.keys(n.s).length
    if (sCount) {
      let sMaxW = 0
      n.sumElapsedY=[0]

      for (let i = 0; i < sCount; i++) {
        mapMeasure.iterate(m, n.s[i], params)
        // console.log('+++', n.s[i].maxH)
        n.familyH += n.s[i].maxH
        let currMaxW = n.s[i].maxW
        if (currMaxW >= sMaxW) {
          sMaxW = currMaxW
        }
        if (params.hasMultipleChild || params.hasMultipleContentRow) {
          n.spacingActivated = 1
        }
      }
      for (let i = 0; i < sCount; i++) {
        n.sumElapsedY.push(n.sumElapsedY[i] + n.s[i].maxH + n.spacingActivated*n.spacing)
        // linear transformation: count of all descendants > count of all children
      }
      if (n.spacingActivated) {
        n.familyH += (sCount - 1)*n.spacing
      }
      n.familyW = sMaxW + m.g.sLineDeltaXDefault
    }
    if (sCount > 1) {
      params.hasMultipleChild = 1
    }
    if (n.type === 'struct' || n.type === 'dir') {
      if (n.hasCell) {
        let rowCount = Object.keys(n.c).length
        let colCount = Object.keys(n.c[0]).length
        let maxCellHeightMat = createArray(rowCount, colCount)
        let maxCellWidthMat = createArray(rowCount, colCount)
        let isCellSpacingActivated = 0
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            mapMeasure.iterate(m, n.c[i][j], params)
            maxCellHeightMat[i][j] = n.c[i][j].maxH
            maxCellWidthMat[i][j] = n.c[i][j].maxW
            if (n.c[i][j].maxH > m.g.defaultH) {
              isCellSpacingActivated = 1
            }
          }
        }
        if (isCellSpacingActivated === 1) {
          for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
              maxCellHeightMat[i][j] += n.spacing
            }
          }
        }
        for (let i = 0; i < rowCount; i++) {
          let maxRowHeight = 0
          for (let j = 0; j < colCount; j++) {
            let cellHeight = maxCellHeightMat[i][j]
            if (cellHeight >= maxRowHeight) {
              maxRowHeight = cellHeight
            }
          }
          n.maxRowHeight.push(maxRowHeight)
          n.sumMaxRowHeight.push(maxRowHeight + n.sumMaxRowHeight.slice(-1)[0])
          n.selfH += maxRowHeight
        }
        for (let j = 0; j < colCount; j++) {
          let maxColWidth = 0
          for (let i = 0; i < rowCount; i++) {
            let cellWidth = maxCellWidthMat[i][j]
            if (cellWidth >= maxColWidth) {
              maxColWidth = cellWidth
            }
            if (n.c[i][j].s[0].taskStatus !== 0) {
              maxColWidth += 120
            }
          }
          n.maxColWidth.push(maxColWidth)
          n.sumMaxColWidth.push(maxColWidth + n.sumMaxColWidth.slice(-1)[0])
          n.selfW += maxColWidth
        }
        for (let j = 0; j < colCount; j++) {
          for (let i = 0; i < rowCount; i++) {
            n.c[i][j].selfW = n.maxColWidth[j]
            n.c[i][j].selfH = n.maxRowHeight[i]
          }
        }
        if (rowCount > 1) {
          params.hasMultipleContentRow = 1
        }
      } else {
        // dependent on change
        if (n.content !== '' && (n.dimW === 0 || n.dimH === 0 || n.dimChange)) {
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
        // not dependent on change
        let paddingW = m.g.padding*2
        let paddingH = m.g.padding*2
        let densityW = 0
        let densityH = 0
        if (n.contentType === 'text') {
          densityW = m.g.density === 'large' ? 0 : 8
          densityH = m.g.density === 'large' ? 1 : 2
        }
        n.selfW = (n.dimW > 20 ? n.dimW : 20) + paddingW + densityW
        n.selfH = n.dimH/17 <= 1 ? m.g.defaultH + densityH : n.dimH + paddingH + densityH
      }
    }
    n.maxW = n.selfW + n.familyW
    n.maxH = Math.max(...[n.selfH, n.familyH])
  }
}
