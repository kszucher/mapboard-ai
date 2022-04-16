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

    iterate: (m, cm) => {
        if (cm.isRoot || cm.type === 'dir') {
            cm.nodeStartX = cm.parentNodeStartX
            cm.nodeEndX = cm.parentNodeEndX
        } else {
            if (cm.type === 'cell' && cm.parentParentType === 'cell' || cm.parentType === 'cell') {
                if (cm.path[3] === 0) {
                    cm.nodeStartX = cm.parentNodeStartX + 2
                    cm.nodeEndX = cm.nodeStartX + cm.selfW
                } else {
                    cm.nodeEndX = cm.parentNodeEndX
                    cm.nodeStartX = cm.nodeEndX - cm.selfW
                }
            }
            if (cm.parentType === 'struct' || cm.parentType === 'dir') {
                if (cm.type === 'struct') {
                    if (cm.path[3] === 0) {
                        cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX
                        cm.nodeEndX = cm.nodeStartX + cm.selfW
                    } else {
                        cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX
                        cm.nodeStartX = cm.nodeEndX - cm.selfW
                    }
                } else if (cm.type === 'cell') {
                    if (cm.parentParentType === 'struct' || cm.parentParentType === 'dir') {
                        let diff = m.sLineDeltaXDefault - 20
                        if (cm.path[3] === 0) {
                            cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX + diff
                            cm.nodeEndX = cm.nodeStartX + cm.selfW
                        } else {
                            cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX - diff
                            cm.nodeStartX = cm.nodeEndX - cm.selfW
                        }
                    }
                }
            }
        }
        cm.nodeY = cm.parentNodeY + cm.lineDeltaY
        if (Number.isInteger(cm.nodeY)) {
            cm.nodeY += 0.5
        }
        if (Number.isInteger(cm.nodeStartX)) {
            if (cm.path[3] === 0) {
                cm.nodeStartX += 0.5
                cm.nodeEndX += 0.5
            } else {
                cm.nodeStartX -= 0.5
                cm.nodeEndX -= 0.5
            }
        }
        let dCount = Object.keys(cm.d).length
        for (let i = 0; i < dCount; i++) {
            cm.d[i].parentNodeStartX = cm.nodeStartX
            cm.d[i].parentNodeEndX = cm.nodeEndX
            cm.d[i].parentNodeY = cm.nodeY
            cm.d[i].lineDeltaX = 0
            cm.d[i].lineDeltaY = 0
            cm.d[i].selfW = cm.selfW
            cm.d[i].selfH = cm.selfH
            cm.d[i].isTop = 1
            cm.d[i].isBottom = 1
            mapPlace.iterate(m, cm.d[i])
        }
        let rowCount = Object.keys(cm.c).length
        let colCount = Object.keys(cm.c[0]).length
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                cm.c[i][j].parentNodeStartX = cm.parentNodeStartX
                cm.c[i][j].parentNodeEndX = cm.parentNodeEndX
                cm.c[i][j].parentNodeY = cm.parentNodeY
                cm.c[i][j].lineDeltaX = cm.sumMaxColWidth[j] + 20
                cm.c[i][j].lineDeltaY = cm.nodeY + cm.sumMaxRowHeight[i] + cm.maxRowHeight[i]/2 - cm.selfH/2 - cm.parentNodeY
                mapPlace.iterate(m, cm.c[i][j])
            }
        }
        let elapsedY = 0
        let sCount = Object.keys(cm.s).length
        for (let i = 0; i < sCount; i++) {
            cm.s[i].parentNodeStartX = cm.nodeStartX
            cm.s[i].parentNodeEndX = cm.nodeEndX
            cm.s[i].parentNodeY = cm.nodeY
            cm.s[i].lineDeltaX = m.sLineDeltaXDefault
            cm.s[i].lineDeltaY = elapsedY + cm.s[i].maxH / 2 - cm.familyH / 2
            if (i === 0 && cm.isTop) cm.s[i].isTop = 1
            if (i === sCount - 1 && cm.isBottom === 1) cm.s[i].isBottom = 1
            mapPlace.iterate(m, cm.s[i])
            elapsedY += cm.s[i].maxH + cm.spacingActivated*cm.spacing
        }
    }
}
