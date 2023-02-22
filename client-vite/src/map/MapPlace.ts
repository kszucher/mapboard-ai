import {M, N} from "../types/DefaultProps"

export const mapPlace = {
  start: (m: M) => {
    const cn = m.r[0]
    const {alignment, taskConfigWidth, taskLeft, taskRight, margin, sLineDeltaXDefault} = m.g
    const leftTaskWidth = cn.d[1].s.length > 0 && taskLeft ? taskConfigWidth: 0
    const leftMapWidth = cn.d[1].s.length > 0 ? sLineDeltaXDefault + cn.d[1].familyW : 0
    const rightMapWidth = cn.d[0].s.length > 0 ? sLineDeltaXDefault + cn.d[0].familyW : 0
    const rightTaskWidth = cn.d[0].s.length > 0 && taskRight ? taskConfigWidth : 0
    const leftWidth = leftMapWidth + leftTaskWidth + margin
    const rightWidth = rightMapWidth + rightTaskWidth + margin
    let flow = 'both'
    if (cn.d[0].s.length && !cn.d[1].s.length) flow = 'right'
    if (!cn.d[0].s.length && cn.d[1].s.length) flow = 'left'
    let sumWidth = 0
    if (alignment === 'adaptive') {
      if (flow === 'right') {
        sumWidth = margin + cn.selfW + rightWidth
      } else if (flow === 'left') {
        sumWidth = leftWidth + cn.selfW + margin
      } else if (flow === 'both') {
        sumWidth = leftWidth + cn.selfW + rightWidth
      }
    } else if (alignment === 'centered') {
      sumWidth = 2*Math.max(...[leftWidth, rightWidth]) + cn.selfW
    }
    const divMinWidth = window.screen.availWidth > 1280 ? 1280 : 800
    const mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
    let mapStartCenterX = 0
    if (alignment === 'centered') {
      mapStartCenterX = mapWidth / 2
    } else if (alignment === 'adaptive') {
      if (flow === 'both') {
        let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
        mapStartCenterX = leftSpace + leftWidth + cn.selfW / 2
      } else if (flow === 'right') {
        mapStartCenterX = margin + cn.selfW / 2
      } else if (flow === 'left') {
        mapStartCenterX = mapWidth - margin - cn.selfW / 2
      }
    }
    const rightMapHeight = cn.d.length > 0 ? cn.d[0].familyH : 0
    const leftMapHeight =  cn.d.length > 1? cn.d[1].familyH : 0
    const minHeight = Math.max(...[rightMapHeight, leftMapHeight])
    const mapHeight = minHeight + 60
    m.g.mapWidth = mapWidth
    m.g.mapHeight = mapHeight
    cn.parentNodeStartX = mapStartCenterX - cn.selfW / 2 + 1
    cn.parentNodeEndX = mapStartCenterX + cn.selfW / 2 + 1
    cn.parentNodeY = 0
    cn.lineDeltaX = 0
    cn.lineDeltaY = minHeight / 2 + 30 - 0.5
    mapPlace.iterate(m, m.r[0])
  },

  iterate: (m: M, cn: N) => {
    if (cn.isRoot || cn.type === 'dir') {
      cn.nodeStartX = cn.parentNodeStartX
      cn.nodeEndX = cn.parentNodeEndX
    } else {
      if (cn.type === 'cell' && cn.parentParentType === 'cell' || cn.parentType === 'cell') {
        if (cn.path[3] === 0) {
          cn.nodeStartX = cn.parentNodeStartX + 2
          cn.nodeEndX = cn.nodeStartX + cn.selfW
        } else {
          cn.nodeEndX = cn.parentNodeEndX
          cn.nodeStartX = cn.nodeEndX - cn.selfW
        }
      }
      if (cn.parentType === 'struct' || cn.parentType === 'dir') {
        if (cn.type === 'struct') {
          if (cn.path[3] === 0) {
            cn.nodeStartX = cn.parentNodeEndX + cn.lineDeltaX
            cn.nodeEndX = cn.nodeStartX + cn.selfW
          } else {
            cn.nodeEndX = cn.parentNodeStartX - cn.lineDeltaX
            cn.nodeStartX = cn.nodeEndX - cn.selfW
          }
        } else if (cn.type === 'cell') {
          if (cn.parentParentType === 'struct' || cn.parentParentType === 'dir') {
            let diff = m.g.sLineDeltaXDefault - 20
            if (cn.path[3] === 0) {
              cn.nodeStartX = cn.parentNodeEndX + cn.lineDeltaX + diff
              cn.nodeEndX = cn.nodeStartX + cn.selfW
            } else {
              cn.nodeEndX = cn.parentNodeStartX - cn.lineDeltaX - diff
              cn.nodeStartX = cn.nodeEndX - cn.selfW
            }
          }
        }
      }
    }
    cn.nodeY = cn.parentNodeY + cn.lineDeltaY
    if (Number.isInteger(cn.nodeY)) {
      cn.nodeY += 0.5
    }
    if (Number.isInteger(cn.nodeStartX)) {
      if (cn.path[3] === 0) {
        cn.nodeStartX += 0.5
        cn.nodeEndX += 0.5
      } else {
        cn.nodeStartX -= 0.5
        cn.nodeEndX -= 0.5
      }
    }
    const dCount = Object.keys(cn.d).length
    for (let i = 0; i < dCount; i++) {
      cn.d[i].parentNodeStartX = cn.nodeStartX
      cn.d[i].parentNodeEndX = cn.nodeEndX
      cn.d[i].parentNodeY = cn.nodeY
      cn.d[i].lineDeltaX = 0
      cn.d[i].lineDeltaY = 0
      cn.d[i].selfW = cn.selfW
      cn.d[i].selfH = cn.selfH
      cn.d[i].isTop = 1
      cn.d[i].isBottom = 1
      mapPlace.iterate(m, cn.d[i])
    }
    const rowCount = Object.keys(cn.c).length
    const colCount = Object.keys(cn.c[0]).length
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        cn.c[i][j].parentNodeStartX = cn.parentNodeStartX
        cn.c[i][j].parentNodeEndX = cn.parentNodeEndX
        cn.c[i][j].parentNodeY = cn.parentNodeY
        cn.c[i][j].lineDeltaX = cn.sumMaxColWidth[j] + 20
        cn.c[i][j].lineDeltaY = cn.nodeY + cn.sumMaxRowHeight[i] + cn.maxRowHeight[i]/2 - cn.selfH/2 - cn.parentNodeY
        mapPlace.iterate(m, cn.c[i][j])
      }
    }
    let elapsedY = 0
    const sCount = Object.keys(cn.s).length
    for (let i = 0; i < sCount; i++) {
      cn.s[i].parentNodeStartX = cn.nodeStartX
      cn.s[i].parentNodeEndX = cn.nodeEndX
      cn.s[i].parentNodeY = cn.nodeY
      cn.s[i].lineDeltaX = m.g.sLineDeltaXDefault
      cn.s[i].lineDeltaY = elapsedY + cn.s[i].maxH / 2 - cn.familyH / 2
      if (i === 0 && cn.isTop) cn.s[i].isTop = 1
      if (i === sCount - 1 && cn.isBottom === 1) cn.s[i].isBottom = 1
      mapPlace.iterate(m, cn.s[i])
      elapsedY += cn.s[i].maxH + cn.spacingActivated*cn.spacing
    }
  }
}
