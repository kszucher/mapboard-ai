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

  iterate: (m, cm, params) => {
    params.hasMultipleChild = 0
    params.hasMultipleContentRow = 0
    let dCount = Object.keys(cm.d).length
    for (let i = 0; i < dCount; i++) {
      mapMeasure.iterate(m, cm.d[i], params)
    }
    let sCount = Object.keys(cm.s).length
    if (sCount) {
      let sMaxW = 0
      for (let i = 0; i < sCount; i++) {
        mapMeasure.iterate(m, cm.s[i], params)
        cm.familyH += cm.s[i].maxH
        let currMaxW = cm.s[i].maxW
        if (currMaxW >= sMaxW) {
          sMaxW = currMaxW
        }
        if (params.hasMultipleChild || params.hasMultipleContentRow) {
          cm.spacingActivated = 1
        }
      }
      if (cm.spacingActivated) {
        cm.familyH += (sCount - 1)*cm.spacing
      }
      cm.familyW = sMaxW + m.sLineDeltaXDefault
    }
    if (sCount > 1) {
      params.hasMultipleChild = 1
    }
    if (cm.type === 'struct' || cm.type === 'dir') {
      if (cm.hasCell) {
        let rowCount = Object.keys(cm.c).length
        let colCount = Object.keys(cm.c[0]).length
        let maxCellHeightMat = createArray(rowCount, colCount)
        let maxCellWidthMat = createArray(rowCount, colCount)
        let isCellSpacingActivated = 0
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            mapMeasure.iterate(m, cm.c[i][j], params)
            maxCellHeightMat[i][j] = cm.c[i][j].maxH
            maxCellWidthMat[i][j] = cm.c[i][j].maxW
            if (cm.c[i][j].maxH > m.defaultH) {
              isCellSpacingActivated = 1
            }
          }
        }
        if (isCellSpacingActivated === 1) {
          for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
              maxCellHeightMat[i][j] += cm.spacing
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
          cm.maxRowHeight.push(maxRowHeight)
          cm.sumMaxRowHeight.push(maxRowHeight + cm.sumMaxRowHeight.slice(-1)[0])
          cm.selfH += maxRowHeight
        }
        for (let j = 0; j < colCount; j++) {
          let maxColWidth = 0
          for (let i = 0; i < rowCount; i++) {
            let cellWidth = maxCellWidthMat[i][j]
            if (cellWidth >= maxColWidth) {
              maxColWidth = cellWidth
            }
            if (cm.c[i][j].s[0].taskStatus !== -1) {
              maxColWidth += 120
            }
          }
          cm.maxColWidth.push(maxColWidth)
          cm.sumMaxColWidth.push(maxColWidth + cm.sumMaxColWidth.slice(-1)[0])
          cm.selfW += maxColWidth
        }
        for (let j = 0; j < colCount; j++) {
          for (let i = 0; i < rowCount; i++) {
            cm.c[i][j].selfW = cm.maxColWidth[j]
            cm.c[i][j].selfH = cm.maxRowHeight[i]
          }
        }
        if (rowCount > 1) {
          params.hasMultipleContentRow = 1
        }
      } else {
        // dependent on change
        if (cm.content !== '' && (cm.dimW === 0 || cm.dimH === 0 || cm.dimChange)) {
          // TODO check if we don't rerender in case of equations once they can save
          if (cm.contentType === 'text') {
            const dim = getTextDim(cm.content, cm.textFontSize)
            cm.dimW = dim[0]
            cm.dimH = dim[1]
          } else if (cm.contentType === 'equation') {
            const dim = getEquationDim(cm.content)
            cm.dimW = dim[0]
            cm.dimH = dim[1]
          } else if (cm.contentType === 'image') {
            // TODO rename imageW, and imageH to dimW, and dimH in mongo, and the REMOVE these lines
            cm.dimW = cm.imageW
            cm.dimH = cm.imageH
          }
        }
        // not dependent on change
        let paddingW = m.padding*2
        let paddingH = m.padding*2
        let densityW = 0
        let densityH = 0
        if (cm.contentType === 'text') {
          densityW = m.density === 'large' ? 0 : 8
          densityH = m.density === 'large' ? 1 : 2
        }
        cm.selfW = (cm.dimW > 20 ? cm.dimW : 20) + paddingW + densityW
        cm.selfH = cm.dimH/17 <= 1 ? m.defaultH + densityH : cm.dimH + paddingH + densityH
      }
    }
    cm.maxW = cm.selfW + cm.familyW
    cm.maxH = Math.max(...[cm.selfH, cm.familyH])
  }
}
