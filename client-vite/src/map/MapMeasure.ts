// @ts-nocheck

import {createArray} from "../core/Utils"
import {getEquationDim, getTextDim} from "../core/DomUtils";

export const mapMeasure = {
  start: (m, cr) => {
    mapMeasure.iterate(m, cr, {
      hasMultipleChild: 0,
      hasMultipleContentRow: 0,
    })
  },

  iterate: (m, cn, params) => {
    params.hasMultipleChild = 0
    params.hasMultipleContentRow = 0
    let dCount = Object.keys(cn.d).length
    for (let i = 0; i < dCount; i++) {
      mapMeasure.iterate(m, cn.d[i], params)
    }
    let sCount = Object.keys(cn.s).length
    if (sCount) {
      let sMaxW = 0
      for (let i = 0; i < sCount; i++) {
        mapMeasure.iterate(m, cn.s[i], params)
        cn.familyH += cn.s[i].maxH
        let currMaxW = cn.s[i].maxW
        if (currMaxW >= sMaxW) {
          sMaxW = currMaxW
        }
        if (params.hasMultipleChild || params.hasMultipleContentRow) {
          cn.spacingActivated = 1
        }
      }
      if (cn.spacingActivated) {
        cn.familyH += (sCount - 1)*cn.spacing
      }
      cn.familyW = sMaxW + m.sLineDeltaXDefault
    }
    if (sCount > 1) {
      params.hasMultipleChild = 1
    }
    if (cn.type === 'struct' || cn.type === 'dir') {
      if (cn.hasCell) {
        let rowCount = Object.keys(cn.c).length
        let colCount = Object.keys(cn.c[0]).length
        let maxCellHeightMat = createArray(rowCount, colCount)
        let maxCellWidthMat = createArray(rowCount, colCount)
        let isCellSpacingActivated = 0
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            mapMeasure.iterate(m, cn.c[i][j], params)
            maxCellHeightMat[i][j] = cn.c[i][j].maxH
            maxCellWidthMat[i][j] = cn.c[i][j].maxW
            if (cn.c[i][j].maxH > m.defaultH) {
              isCellSpacingActivated = 1
            }
          }
        }
        if (isCellSpacingActivated === 1) {
          for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
              maxCellHeightMat[i][j] += cn.spacing
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
          cn.maxRowHeight.push(maxRowHeight)
          cn.sumMaxRowHeight.push(maxRowHeight + cn.sumMaxRowHeight.slice(-1)[0])
          cn.selfH += maxRowHeight
        }
        for (let j = 0; j < colCount; j++) {
          let maxColWidth = 0
          for (let i = 0; i < rowCount; i++) {
            let cellWidth = maxCellWidthMat[i][j]
            if (cellWidth >= maxColWidth) {
              maxColWidth = cellWidth
            }
            if (cn.c[i][j].s[0].taskStatus !== -1) {
              maxColWidth += 120
            }
          }
          cn.maxColWidth.push(maxColWidth)
          cn.sumMaxColWidth.push(maxColWidth + cn.sumMaxColWidth.slice(-1)[0])
          cn.selfW += maxColWidth
        }
        for (let j = 0; j < colCount; j++) {
          for (let i = 0; i < rowCount; i++) {
            cn.c[i][j].selfW = cn.maxColWidth[j]
            cn.c[i][j].selfH = cn.maxRowHeight[i]
          }
        }
        if (rowCount > 1) {
          params.hasMultipleContentRow = 1
        }
      } else {
        // dependent on change
        if (cn.content !== '' && (cn.dimW === 0 || cn.dimH === 0 || cn.dimChange)) {
          // TODO check if we don't rerender in case of equations once they can save
          if (cn.contentType === 'text') {
            const dim = getTextDim(cn.content, cn.textFontSize)
            cn.dimW = dim[0]
            cn.dimH = dim[1]
          } else if (cn.contentType === 'equation') {
            const dim = getEquationDim(cn.content)
            cn.dimW = dim[0]
            cn.dimH = dim[1]
          } else if (cn.contentType === 'image') {
            // TODO rename imageW, and imageH to dimW, and dimH in mongo, and the REMOVE these lines
            cn.dimW = cn.imageW
            cn.dimH = cn.imageH
          }
        }
        // not dependent on change
        let paddingW = m.padding*2
        let paddingH = m.padding*2
        let densityW = 0
        let densityH = 0
        if (cn.contentType === 'text') {
          densityW = m.density === 'large' ? 0 : 8
          densityH = m.density === 'large' ? 1 : 2
        }
        cn.selfW = (cn.dimW > 20 ? cn.dimW : 20) + paddingW + densityW
        cn.selfH = cn.dimH/17 <= 1 ? m.defaultH + densityH : cn.dimH + paddingH + densityH
      }
    }
    cn.maxW = cn.selfW + cn.familyW
    cn.maxH = Math.max(...[cn.selfH, cn.familyH])
  }
}
