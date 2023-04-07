import {getNodeById, getNodeByPath, getPathPattern, isD, isR, isS} from "./MapUtils"
import {M} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {N} from "../state/NPropsTypes"
import {getEquationDim, getTextDim} from "../component/MapDivUtils"
import {createArray} from "../core/Utils"

export const mapMeasure = (pmp: M, mp: M) => {
  const g = getNodeByPath(mp, ['g']) as G
  const r0 = getNodeByPath(mp, ['r', 0]) as N
  const r0d0 = getNodeByPath(mp, ['r', 0, 'd', 0]) as N
  const r0d1 = getNodeByPath(mp, ['r', 0, 'd', 1]) as N

  for (let nIndex = mp.length - 1; nIndex > - 1; nIndex--) {
    const n = mp[nIndex]
    const pn = getNodeById(pmp, n.nodeId)
    if (mp.find(nt => ( // TODO use isSubNode for the following two lines...
      n.path.length < nt.path.length  &&
      n.path.join('') === nt.path.slice(0, n.path.length).join('') &&
      ['ss', 'sc'].includes(getPathPattern(nt.path.slice(n.path.length))))
    )) {
      n.spacingActivated = 1
    }
    if (isR(n.path) || isD(n.path) || isS(n.path)) {
      if (n.cRowCount || n.cColCount) {
        let maxCellHeightMat = createArray(n.cRowCount, n.cColCount)
        let maxCellWidthMat = createArray(n.cRowCount, n.cColCount)
        let isCellSpacingActivated = 0
        for (let i = 0; i < n.cRowCount; i++) {
          for (let j = 0; j < n.cColCount; j++) {
            const cn = getNodeByPath(mp, [...n.path, 'c', i, j]) as N
            maxCellHeightMat[i][j] = cn.maxH
            maxCellWidthMat[i][j] = cn.maxW
            if (cn.maxH > g.defaultH) {
              isCellSpacingActivated = 1
            }
          }
        }
        if (isCellSpacingActivated === 1) {
          for (let i = 0; i < n.cRowCount; i++) {
            for (let j = 0; j < n.cColCount; j++) {
              maxCellHeightMat[i][j] += n.spacing
            }
          }
        }
        for (let i = 0; i < n.cRowCount; i++) {
          let maxRowHeight = 0
          for (let j = 0; j < n.cColCount; j++) {
            let cellHeight = maxCellHeightMat[i][j]
            if (cellHeight >= maxRowHeight) {
              maxRowHeight = cellHeight
            }
          }
          n.maxRowHeight.push(maxRowHeight)
          n.sumMaxRowHeight.push(maxRowHeight + n.sumMaxRowHeight.slice(-1)[0])
          n.selfH += maxRowHeight
        }
        for (let j = 0; j < n.cColCount; j++) {
          let maxColWidth = 0
          for (let i = 0; i < n.cRowCount; i++) {
            let cellWidth = maxCellWidthMat[i][j]
            if (cellWidth >= maxColWidth) {
              maxColWidth = cellWidth
            }
            const cn = getNodeByPath(mp, [...n.path, 'c', i, j, 's', 0]) as N
            if (cn.taskStatus !== 0) {
              maxColWidth += 120
            }
          }
          n.maxColWidth.push(maxColWidth)
          n.sumMaxColWidth.push(maxColWidth + n.sumMaxColWidth.slice(-1)[0])
          n.selfW += maxColWidth
        }
        for (let j = 0; j < n.cColCount; j++) {
          for (let i = 0; i < n.cRowCount; i++) {
            const cn = getNodeByPath(mp, [...n.path, 'c', i, j]) as N
            cn.selfW = n.maxColWidth[j]
            cn.selfH = n.maxRowHeight[i]
          }
        }
      } else {
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
        // not dependent on change
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
    }
    if (n.sCount) {
      let sMaxW = 0
      for (let i = 0; i < n.sCount; i++) {
        const cn = getNodeByPath(mp, [...n.path, 's', i]) as N
        n.familyH += cn.maxH
        let currMaxW = cn.maxW
        if (currMaxW >= sMaxW) {
          sMaxW = currMaxW
        }
      }
      if (n.spacingActivated) {
        n.familyH += (n.sCount - 1)*n.spacing
      }
      n.familyW = sMaxW + g.sLineDeltaXDefault
    }
    n.maxW = n.selfW + n.familyW
    n.maxH = Math.max(...[n.selfH, n.familyH])
  }
}
