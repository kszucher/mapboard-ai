import { updateMapSvgData } from '../core/DomFlow'
import { isOdd } from '../core/Utils'
import { resolveScope } from '../core/DefaultProps'
import { selectionState } from '../core/SelectionFlow'
import { mapref } from '../core/MapStackFlow'
import { getColors } from '../core/Colors'
import { getArcPath, getBezierPath, getLinePath, getPolygonPath } from '../core/SvgUtils'

export const mapVisualizeSvg = {
    start: (m, cr, colorMode) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter')
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)'
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)'
        const {nodeId} = m
        const {MAP_BACKGROUND} = getColors(colorMode)
        updateMapSvgData(nodeId, 'backgroundRect', {
            x: 0,
            y: 0,
            width: m.mapWidth,
            height: m.mapHeight,
            rx: 32,
            ry: 32,
            fill: MAP_BACKGROUND,
        })
        if (m.moveData?.length) {
            // TODO use parent bezier style
            const deltaX = m.moveData[2] - m.moveData[0]
            const deltaY = m.moveData[3] - m.moveData[1]
            const x1 = m.moveData[0]
            const y1 = m.moveData[1]
            const c1x = m.moveData[0] + deltaX / 4
            const c1y = m.moveData[1]
            const c2x = m.moveData[0] + deltaX / 4
            const c2y = m.moveData[1] + deltaY
            const x2 = m.moveData[2]
            const y2 = m.moveData[3]
            updateMapSvgData(nodeId, 'moveLine', {
                path: getBezierPath('M', [x1, y1, c1x, c1y, c2x, c2y, x2, y2]),
                stroke: '#5f0a87',
                strokeWidth: 1,
                preventTransition: 1,
            })
            updateMapSvgData(nodeId, 'moveRect', {
                x: x2 - 10,
                y: y2 - 10,
                width: 20,
                height: 20,
                rx: 8,
                ry: 8,
                fill: MAP_BACKGROUND,
                fillOpacity: 1,
                stroke: '#5f0a87',
                strokeWidth: 5,
                preventTransition: 1,
            })
        }
        if (m.selectionRect?.length) {
            updateMapSvgData(nodeId, 'selectionRect', {
                x: m.selectionRect[0],
                y: m.selectionRect[1],
                width: m.selectionRect[2],
                height: m.selectionRect[3],
                rx: 8,
                ry: 8,
                fill: '#5f0a87',
                fillOpacity: 0.05,
                strokeWidth: 2,
                preventTransition: 1,
            })
        }
        mapVisualizeSvg.iterate(m, cr, colorMode)
    },

    iterate: (m, cm, colorMode) => {
        const {nodeId} = cm
        const conditions = resolveScope(cm)
        const {TABLE_GRID, TASK_FILL_TODO, TASK_FILL_IN_PROGRESS, TASK_FILL_DONE, TASK_LINE} = getColors(colorMode)

        const selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH
        const maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH
        const nsx = cm.path[3] ? cm.nodeEndX : cm.nodeStartX
        const nex = cm.path[3] ? cm.nodeStartX : cm.nodeEndX
        const nsy = cm.nodeY - selfHadj/2
        const ney = cm.nodeY + selfHadj/2
        const dir = cm.path[3] ? -1 : 1
        const r = 8
        let animationInit = ''
        if (cm.lineAnimationRequested) {
            cm.lineAnimationRequested = 0
            animationInit = 'l'
        }
        if (conditions.branchFill ||
            conditions.nodeFill ||
            conditions.branchBorder ||
            conditions.nodeBorder ||
            conditions.selectionBorder ||
            conditions.selectionBorderTable) {
            let corr = dir === -1 ? -1 : 0
            let sParams = {
                ax: nsx + 1 * dir + corr,
                bx: nex - 3 * dir + corr,
                cx: nex - 2 * dir + corr,
                ayu: nsy + 1,
                ayd: ney - 3,
                bcyu: nsy + 1,
                bcyd: ney - 3,
            }
            let fParams = {
                ax: nsx + corr,
                bx: nex + dir * cm.lineDeltaX + corr,
                cx: nsx + dir * (cm.familyW + cm.selfW),
                ayu: nsy,
                ayd: ney,
                bcyu: cm.nodeY - maxHadj / 2,
                bcyd: cm.nodeY + maxHadj / 2,
            }
            if (conditions.branchFill) {
                updateMapSvgData(nodeId, 'branchFill', {
                    path: getPolygonPath(fParams, 'f', dir, 0),
                    fill: cm.fFillColor,
                })
            }
            if (conditions.nodeFill) {
                // important note: if we don't assign this directly, we can remember settings BEFORE task mode on
                if (cm.task) {
                    if (cm.taskStatus !== -1) {
                        if (cm.taskStatus === 0) {
                            cm.sFillColor = ''
                        } else {
                            switch (cm.taskStatus) {
                                case 0: cm.sFillColor = ''; break
                                case 1: cm.sFillColor = TASK_FILL_TODO; break
                                case 2: cm.sFillColor = TASK_FILL_IN_PROGRESS; break
                                case 3: cm.sFillColor = TASK_FILL_DONE; break
                            }
                        }
                    }
                }
                updateMapSvgData(nodeId, 'nodeFill', {
                    path: getPolygonPath(sParams, 's', dir, 0),
                    fill: cm.sFillColor,
                })
            }
            if (conditions.branchBorder) {
                updateMapSvgData(nodeId, 'branchBorder', {
                    path: getPolygonPath(fParams, 'f', dir, 0), // margin will depend on stroke width
                    stroke: cm.fBorderColor,
                    strokeWidth: cm.fBorderWidth,
                })
            }
            if (conditions.nodeBorder) {
                updateMapSvgData(nodeId, 'nodeBorder', {
                    path: getPolygonPath(sParams, 's', dir, 0), // margin will depend on stroke width
                    stroke: cm.sBorderColor,
                    strokeWidth: cm.sBorderWidth,
                })
            }
            if (conditions.selectionBorder) {
                updateMapSvgData(nodeId, 'selectionBorder', {
                    path: getPolygonPath(
                        cm.selection  === 's'
                            ? sParams
                            : fParams,
                        cm.selection,
                        dir,
                        cm.selection === 's'
                            ? cm.sBorderColor !== '' ? 4 : 0
                            : cm.fBorderColor !== '' ? 4 : 0
                    ),
                    stroke: '#666666',
                    strokeWidth: 1,
                })
            }
            if (conditions.selectionBorderTable) {
                updateMapSvgData(nodeId, 'selectionBorderTable', {
                    path: getArcPath(nsx, nsy, cm.selfW, cm.selfH, r, dir, 4),
                    stroke: '#666666',
                    strokeWidth: 1,
                })
            }
        }
        if (conditions.line) {
            let x1, y1, x2, y2
            if (animationInit === 'l') {
                x1 = cm.path[3] ? cm.parentNodeStartXFrom : cm.parentNodeEndXFrom
                y1 = cm.parentNodeYFrom
            } else {
                x1 = cm.path[3] ? cm.parentNodeStartX : cm.parentNodeEndX
                y1 = cm.parentNodeY
            }
            x1 = isOdd(x1)?x1-0.5:x1
            x2 = nsx
            y2 = cm.nodeY
            if (cm.task) {
                if (cm.taskStatus !== -1) {
                    switch (cm.taskStatus) {
                        case 0: cm.lineColor = '#bbbbbb';  break
                        case 1: cm.lineColor = '#2c9dfc';  break
                        case 2: cm.lineColor = '#d5802a';  break
                        case 3: cm.lineColor = '#25bf25';  break
                    }
                }
            }
            updateMapSvgData(nodeId, 'line', {
                path: getLinePath(cm.lineType, x1, y1, cm.lineDeltaX, cm.lineDeltaY, x2, y2, dir),
                stroke: cm.lineColor,
                strokeWidth: cm.lineWidth,
            })
        }
        if (conditions.table) {
            // frame
            updateMapSvgData(nodeId, 'tableFrame', {
                path: getArcPath(nsx, nsy, cm.selfW, cm.selfH, r, dir, 0),
                stroke: cm.cBorderColor,
                strokeWidth: cm.sBorderWidth,
            })
            // grid
            let path = ''
            let rowCount = Object.keys(cm.c).length
            for (let i = 1; i < rowCount; i++) {
                let x1 = cm.nodeStartX
                let x2 = cm.nodeEndX
                let y = nsy + cm.sumMaxRowHeight[i]
                path += `M${x1},${y} L${x2},${y}`
            }
            let colCount = Object.keys(cm.c[0]).length
            for (let j = 1; j < colCount; j++) {
                let x = nsx + dir*cm.sumMaxColWidth[j]
                path += `M${x},${nsy} L${x},${ney}`
            }
            updateMapSvgData(nodeId, 'tableGrid', {
                path: path,
                stroke: TABLE_GRID,
                strokeWidth: 1,
            })
            // cell
            tableLoops:
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        if (cm.c[i][j].selected) {
                            let sx, sy, w, h
                            let sc = selectionState
                            if (sc.cellRowSelected) {
                                sx = nsx
                                sy = nsy + cm.sumMaxRowHeight[i]
                                w = cm.selfW
                                h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i]
                            } else if (sc.cellColSelected) {
                                sx = nsx + dir*cm.sumMaxColWidth[j]
                                sy = nsy
                                w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j]
                                h = cm.selfH
                            } else {
                                sx = nsx + dir*cm.sumMaxColWidth[j]
                                sy = nsy + cm.sumMaxRowHeight[i]
                                w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j]
                                h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i]
                            }
                            updateMapSvgData(nodeId, 'tableCellFrame', {
                                path: getArcPath(sx, sy, w, h, r, dir, 0),
                                stroke: '#000000',
                                strokeWidth: 1,
                            })
                            break tableLoops
                        }
                    }
                }
        }
        if (conditions.task) {
            let {mapWidth, margin, taskConfigN, taskConfigD, taskConfigGap, taskConfigWidth} = m
            let startX
            if (cm.path.includes('c')) {
                let coverCellPath = cm.path.slice(0, cm.path.lastIndexOf('c'))
                let currCol = cm.path[cm.path.lastIndexOf('c') + 2]
                let coverCellRef = mapref(coverCellPath)
                let smcv = coverCellRef.sumMaxColWidth[currCol]
                let mcv = coverCellRef.maxColWidth[currCol]
                startX = cm.path[3]
                    ? coverCellRef.nodeEndX - smcv - mcv + 120
                    : coverCellRef.nodeStartX + smcv + mcv - 120
            } else {
                startX = cm.path[3] ? margin + taskConfigWidth : mapWidth - taskConfigWidth - margin
            }
            let x1 = nex
            let x2 = startX
            let y = cm.nodeY
            if (!cm.isEditing) {
                updateMapSvgData(nodeId, 'taskLine', {
                    path: `M${x1},${y} L${x2},${y}`,
                    stroke: TASK_LINE,
                    strokeWidth: 1,
                })
            }
            for (let i = 0; i < taskConfigN; i++) {
                let centerX = cm.path[3]
                    ? startX - taskConfigD/2 - i * (taskConfigD + taskConfigGap)
                    : startX + taskConfigD/2 + i * (taskConfigD + taskConfigGap)
                let centerY = cm.nodeY
                let fill
                if (cm.taskStatus === i) {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break
                        case 1: fill = '#2c9dfc'; break
                        case 2: fill = '#d5802a'; break
                        case 3: fill = '#25bf25'; break
                    }
                } else {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break
                        case 1: fill = '#e5f3fe'; break
                        case 2: fill = '#f6e5d4'; break
                        case 3: fill = '#e5f9e5'; break
                    }
                }
                updateMapSvgData(nodeId, `taskCircle${i}`, {
                    cx: centerX,
                    cy: centerY,
                    r: taskConfigD/2,
                    fill: fill,
                })
            }
        }
        cm.d.map(i => mapVisualizeSvg.iterate(m, i, colorMode))
        cm.s.map(i => mapVisualizeSvg.iterate(m, i, colorMode))
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j, colorMode)))
    }
}
