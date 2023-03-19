import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapPlace = {
  start: (m: M) => {
    const n = m.r[0]
    const {alignment, taskConfigWidth, taskLeft, taskRight, margin, sLineDeltaXDefault} = m.g
    const leftTaskWidth = n.d[1].s.length > 0 && taskLeft ? taskConfigWidth: 0
    const leftMapWidth = n.d[1].s.length > 0 ? sLineDeltaXDefault + n.d[1].familyW : 0
    const rightMapWidth = n.d[0].s.length > 0 ? sLineDeltaXDefault + n.d[0].familyW : 0
    const rightTaskWidth = n.d[0].s.length > 0 && taskRight ? taskConfigWidth : 0
    const leftWidth = leftMapWidth + leftTaskWidth + margin
    const rightWidth = rightMapWidth + rightTaskWidth + margin
    let flow = 'both'
    if (n.d[0].s.length && !n.d[1].s.length) flow = 'right'
    if (!n.d[0].s.length && n.d[1].s.length) flow = 'left'
    let sumWidth = 0
    if (alignment === 'adaptive') {
      if (flow === 'right') {
        sumWidth = margin + n.selfW + rightWidth
      } else if (flow === 'left') {
        sumWidth = leftWidth + n.selfW + margin
      } else if (flow === 'both') {
        sumWidth = leftWidth + n.selfW + rightWidth
      }
    } else if (alignment === 'centered') {
      sumWidth = 2*Math.max(...[leftWidth, rightWidth]) + n.selfW
    }
    const divMinWidth = window.screen.availWidth > 1280 ? 1280 : 800
    const mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
    let mapStartCenterX = 0
    if (alignment === 'centered') {
      mapStartCenterX = mapWidth / 2
    } else if (alignment === 'adaptive') {
      if (flow === 'both') {
        let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
        mapStartCenterX = leftSpace + leftWidth + n.selfW / 2
      } else if (flow === 'right') {
        mapStartCenterX = margin + n.selfW / 2
      } else if (flow === 'left') {
        mapStartCenterX = mapWidth - margin - n.selfW / 2
      }
    }
    const rightMapHeight = n.d.length > 0 ? n.d[0].familyH : 0
    const leftMapHeight =  n.d.length > 1? n.d[1].familyH : 0
    const minHeight = Math.max(...[rightMapHeight, leftMapHeight])
    const mapHeight = minHeight + 60
    m.g.mapWidth = mapWidth
    m.g.mapHeight = mapHeight
    n.parentNodeStartX = mapStartCenterX - n.selfW / 2 + 1
    n.parentNodeEndX = mapStartCenterX + n.selfW / 2 + 1
    n.parentNodeY = 0
    n.lineDeltaX = 0
    n.lineDeltaY = minHeight / 2 + 30 - 0.5
    mapPlace.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    if (n.isRoot || n.type === 'dir') {
      n.nodeStartX = n.parentNodeStartX
      n.nodeEndX = n.parentNodeEndX
    } else {
      if (n.type === 'cell' && n.parentParentType === 'cell' || n.parentType === 'cell') {
        if (n.path[3] === 0) {
          n.nodeStartX = n.parentNodeStartX + 2
          n.nodeEndX = n.nodeStartX + n.selfW
        } else {
          n.nodeEndX = n.parentNodeEndX
          n.nodeStartX = n.nodeEndX - n.selfW
        }
      }
      if (n.parentType === 'struct' || n.parentType === 'dir') {
        if (n.type === 'struct') {
          if (n.path[3] === 0) {
            n.nodeStartX = n.parentNodeEndX + n.lineDeltaX
            n.nodeEndX = n.nodeStartX + n.selfW
          } else {
            n.nodeEndX = n.parentNodeStartX - n.lineDeltaX
            n.nodeStartX = n.nodeEndX - n.selfW
          }
        } else if (n.type === 'cell') {
          if (n.parentParentType === 'struct' || n.parentParentType === 'dir') {
            let diff = m.g.sLineDeltaXDefault - 20
            if (n.path[3] === 0) {
              n.nodeStartX = n.parentNodeEndX + n.lineDeltaX + diff
              n.nodeEndX = n.nodeStartX + n.selfW
            } else {
              n.nodeEndX = n.parentNodeStartX - n.lineDeltaX - diff
              n.nodeStartX = n.nodeEndX - n.selfW
            }
          }
        }
      }
    }
    n.nodeY = n.parentNodeY + n.lineDeltaY
    if (Number.isInteger(n.nodeY)) {
      n.nodeY += 0.5
    }
    if (Number.isInteger(n.nodeStartX)) {
      if (n.path[3] === 0) {
        n.nodeStartX += 0.5
        n.nodeEndX += 0.5
      } else {
        n.nodeStartX -= 0.5
        n.nodeEndX -= 0.5
      }
    }
    const dCount = Object.keys(n.d).length
    for (let i = 0; i < dCount; i++) {
      n.d[i].parentNodeStartX = n.nodeStartX
      n.d[i].parentNodeEndX = n.nodeEndX
      n.d[i].parentNodeY = n.nodeY
      n.d[i].lineDeltaX = 0
      n.d[i].lineDeltaY = 0
      n.d[i].selfW = n.selfW
      n.d[i].selfH = n.selfH
      n.d[i].isTop = 1
      n.d[i].isBottom = 1
      mapPlace.iterate(m, n.d[i])
    }
    const rowCount = Object.keys(n.c).length
    const colCount = Object.keys(n.c[0]).length
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        n.c[i][j].parentNodeStartX = n.parentNodeStartX
        n.c[i][j].parentNodeEndX = n.parentNodeEndX
        n.c[i][j].parentNodeY = n.parentNodeY
        n.c[i][j].lineDeltaX = n.sumMaxColWidth[j] + 20
        n.c[i][j].lineDeltaY = n.nodeY + n.sumMaxRowHeight[i] + n.maxRowHeight[i]/2 - n.selfH/2 - n.parentNodeY
        mapPlace.iterate(m, n.c[i][j])
      }
    }
    let elapsedY = 0
    const sCount = Object.keys(n.s).length
    for (let i = 0; i < sCount; i++) {
      n.s[i].parentNodeStartX = n.nodeStartX
      n.s[i].parentNodeEndX = n.nodeEndX
      n.s[i].parentNodeY = n.nodeY
      n.s[i].lineDeltaX = m.g.sLineDeltaXDefault
      n.s[i].lineDeltaY = elapsedY + n.s[i].maxH / 2 - n.familyH / 2
      if (i === 0 && n.isTop) n.s[i].isTop = 1
      if (i === sCount - 1 && n.isBottom === 1) n.s[i].isBottom = 1
      mapPlace.iterate(m, n.s[i])
      elapsedY += n.s[i].maxH + n.spacingActivated*n.spacing
    }
  }
}
