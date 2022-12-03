// @ts-nocheck

export const mapPlace = {
  start: (m, cr) => {
    let {alignment, taskConfigWidth, taskLeft, taskRight, margin, sLineDeltaXDefault} = m
    let leftTaskWidth =     cr.d[1].s.length > 0 && taskLeft ? taskConfigWidth: 0
    let leftMapWidth =      cr.d[1].s.length > 0 ? sLineDeltaXDefault + cr.d[1].familyW : 0
    let rightMapWidth =     cr.d[0].s.length > 0 ? sLineDeltaXDefault + cr.d[0].familyW : 0
    let rightTaskWidth =    cr.d[0].s.length > 0 && taskRight ? taskConfigWidth : 0
    let leftWidth = leftMapWidth + leftTaskWidth + margin
    let rightWidth = rightMapWidth + rightTaskWidth + margin
    let flow = 'both'
    if (cr.d[0].s.length && !cr.d[1].s.length) flow = 'right'
    if (!cr.d[0].s.length && cr.d[1].s.length) flow = 'left'
    let sumWidth = 0
    if (alignment === 'adaptive') {
      if (flow === 'right') {
        sumWidth = margin + cr.selfW + rightWidth
      } else if (flow === 'left') {
        sumWidth = leftWidth + cr.selfW + margin
      } else if (flow === 'both') {
        sumWidth = leftWidth + cr.selfW + rightWidth
      }
    } else if (alignment === 'centered') {
      sumWidth = 2*Math.max(...[leftWidth, rightWidth]) + cr.selfW
    }
    let divMinWidth = window.screen.availWidth > 1280 ? 1280 : 800
    let mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
    let mapStartCenterX = 0
    if (alignment === 'centered') {
      mapStartCenterX = mapWidth / 2
    } else if (alignment === 'adaptive') {
      if (flow === 'both') {
        let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
        mapStartCenterX = leftSpace + leftWidth + cr.selfW / 2
      } else if (flow === 'right') {
        mapStartCenterX = margin + cr.selfW / 2
      } else if (flow === 'left') {
        mapStartCenterX = mapWidth - margin - cr.selfW / 2
      }
    }
    let rightMapHeight = cr.d.length > 0 ? cr.d[0].familyH : 0
    let leftMapHeight =  cr.d.length > 1? cr.d[1].familyH : 0
    let minHeight = Math.max(...[rightMapHeight, leftMapHeight])
    let mapHeight = minHeight + 60
    m.mapWidth = mapWidth
    m.mapHeight = mapHeight
    cr.parentNodeStartX = mapStartCenterX - cr.selfW / 2 + 1
    cr.parentNodeEndX = mapStartCenterX + cr.selfW / 2 + 1
    cr.parentNodeY = 0
    cr.lineDeltaX = 0
    cr.lineDeltaY = minHeight / 2 + 30 - 0.5
    mapPlace.iterate(m, cr)
  },

  iterate: (m, cn) => {
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
            let diff = m.sLineDeltaXDefault - 20
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
    let dCount = Object.keys(cn.d).length
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
    let rowCount = Object.keys(cn.c).length
    let colCount = Object.keys(cn.c[0]).length
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
    let sCount = Object.keys(cn.s).length
    for (let i = 0; i < sCount; i++) {
      cn.s[i].parentNodeStartX = cn.nodeStartX
      cn.s[i].parentNodeEndX = cn.nodeEndX
      cn.s[i].parentNodeY = cn.nodeY
      cn.s[i].lineDeltaX = m.sLineDeltaXDefault
      cn.s[i].lineDeltaY = elapsedY + cn.s[i].maxH / 2 - cn.familyH / 2
      if (i === 0 && cn.isTop) cn.s[i].isTop = 1
      if (i === sCount - 1 && cn.isBottom === 1) cn.s[i].isBottom = 1
      mapPlace.iterate(m, cn.s[i])
      elapsedY += cn.s[i].maxH + cn.spacingActivated*cn.spacing
    }
  }
}
