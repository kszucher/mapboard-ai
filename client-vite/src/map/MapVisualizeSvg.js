import { updateMapSvgData } from '../core/DomFlow'
import { arraysSame, isOdd } from '../core/Utils'
import { resolveScope } from '../core/DefaultProps'
import { selectionState } from '../core/SelectionFlow'
import { getColors } from '../core/Colors'
import { getArcPath, getBezierPath, getLinePath, getPolygonPath } from '../core/SvgUtils'
import { mapref } from '../component/WindowListeners'

export const mapVisualizeSvg = {
    start: (m, cr, colorMode) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter')
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)'
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)'
        const {MAP_BACKGROUND, MOVE_LINE_COLOR, MOVE_RECT_COLOR, SELECTION_RECT_COLOR} = getColors(colorMode)
        updateMapSvgData(m.nodeId, 'backgroundRect', {
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
            updateMapSvgData(m.nodeId, 'moveLine', {
                path: getBezierPath('M', [x1, y1, c1x, c1y, c2x, c2y, x2, y2]),
                stroke: MOVE_LINE_COLOR,
                strokeWidth: 1,
                preventTransition: 1,
            })
            updateMapSvgData(m.nodeId, 'moveRect', {
                x: x2 - 10,
                y: y2 - 10,
                width: 20,
                height: 20,
                rx: 8,
                ry: 8,
                fill: MAP_BACKGROUND,
                fillOpacity: 1,
                stroke: MOVE_RECT_COLOR,
                strokeWidth: 5,
                preventTransition: 1,
            })
        }
        if (m.selectionRect?.length) {
            updateMapSvgData(m.nodeId, 'selectionRect', {
                x: m.selectionRect[0],
                y: m.selectionRect[1],
                width: m.selectionRect[2],
                height: m.selectionRect[3],
                rx: 8,
                ry: 8,
                fill: SELECTION_RECT_COLOR,
                fillOpacity: 0.05,
                strokeWidth: 2,
                preventTransition: 1,
            })
        }
        mapVisualizeSvg.iterate(m, cr, colorMode)
    },

    iterate: (m, cm, colorMode) => {
        const conditions = resolveScope(cm)
        const {
            SELECTION_COLOR,
            TABLE_FRAME_COLOR,
            TABLE_GRID,
            TASK_LINE_1, TASK_LINE_2, TASK_LINE_3,
            TASK_FILL_1, TASK_FILL_2, TASK_FILL_3,
            TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE,
            TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE,
            TASK_LINE
        } = getColors(colorMode)

        const selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH
        const maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH
        const dir = cm.path[3] ? - 1 : 1
        const nsx = dir === - 1 ? cm.nodeEndX : cm.nodeStartX
        const nex = dir === - 1 ? cm.nodeStartX : cm.nodeEndX
        const nsy = cm.nodeY - selfHadj/2
        const ney = cm.nodeY + selfHadj/2
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
            conditions.selectionBorder
        ) {
            let sParams = {
                ax: dir ===  - 1 ? nex : nsx,
                bx: nex - dir * r,
                cx: dir === - 1 ? nsx : nex,
                ayu: nsy,
                ayd: ney,
                byu: nsy,
                byd: ney,
                cyu: nsy,
                cyd: ney
            }
            let fParams = {
                ax: dir === - 1 ? nsx + dir * (cm.familyW + cm.selfW) : nsx,
                bx: nex + dir * cm.lineDeltaX,
                cx: dir === - 1 ? nsx : nsx + dir * (cm.familyW + cm.selfW),
                ayu: dir === - 1 ? cm.nodeY - maxHadj / 2 : nsy,
                ayd: dir === - 1 ? cm.nodeY + maxHadj / 2 : ney,
                byu: cm.nodeY - maxHadj / 2,
                byd: cm.nodeY + maxHadj / 2,
                cyu: dir === - 1 ? nsy : cm.nodeY - maxHadj / 2,
                cyd: dir === - 1 ? ney : cm.nodeY + maxHadj / 2,
            }
            if (conditions.branchFill) {
                updateMapSvgData(cm.nodeId, 'branchFill', {
                    path: getPolygonPath(fParams, 'f', dir, 0),
                    fill: cm.fFillColor,
                })
            }
            if (conditions.nodeFill) {
                let sFillColorOverride = ''
                if (cm.taskStatus > 0) {
                    sFillColorOverride = [TASK_FILL_1, TASK_FILL_2, TASK_FILL_3].at(cm.taskStatus - 1)
                }
                updateMapSvgData(cm.nodeId, 'nodeFill', {
                    path: getArcPath(nsx, nsy , cm.selfW, cm.selfH, r, dir, -2, true),
                    fill: sFillColorOverride === '' ? cm.sFillColor : sFillColorOverride
                })
            }
            if (conditions.branchBorder) {
                updateMapSvgData(cm.nodeId, 'branchBorder', {
                    path: getPolygonPath(fParams, 'f', dir, 0),
                    stroke: cm.fBorderColor,
                    strokeWidth: cm.fBorderWidth,
                })
            }
            if (conditions.nodeBorder) {
                updateMapSvgData(cm.nodeId, 'nodeBorder', {
                    path: getArcPath(nsx, nsy , cm.selfW, cm.selfH, r, dir, -2, true),
                    stroke: cm.sBorderColor,
                    strokeWidth: cm.sBorderWidth,
                })
            }
            if (conditions.selectionBorder) {
                let margin = (
                    (cm.selection === 's' && cm.sBorderColor !== '') ||
                    (cm.selection === 's' && cm.sFillColor !== '') ||
                    (cm.selection === 'f') ||
                    (cm.taskStatus > 0) ||
                    (cm.hasCell)
                ) ? 4 : -2
                let isLast = arraysSame(selectionState.lastPath, cm.path)
                updateMapSvgData(isLast ? m.nodeId : cm.nodeId, 'selectionBorder', {
                    path: getPolygonPath({s: sParams, f: fParams}[cm.selection], cm.selection, dir, margin),
                    stroke: SELECTION_COLOR,
                    strokeWidth: 1,
                })
            }
        }
        if (conditions.line) {
            let x1, y1, x2, y2
            if (animationInit === 'l') {
                x1 = dir === - 1 ? cm.parentNodeStartXFrom : cm.parentNodeEndXFrom
                y1 = cm.parentNodeYFrom
            } else {
                x1 = dir === - 1 ? cm.parentNodeStartX : cm.parentNodeEndX
                y1 = cm.parentNodeY
            }
            x1 = isOdd(x1)?x1-0.5:x1
            x2 = nsx
            y2 = cm.nodeY
            let lineColorOverride = ''
            if (cm.taskStatus > 0) {
                lineColorOverride = [TASK_LINE_1, TASK_LINE_2, TASK_LINE_3].at(cm.taskStatus - 1)
            }
            updateMapSvgData(cm.nodeId, 'line', {
                path: getLinePath(cm.lineType, x1, y1, cm.lineDeltaX, cm.lineDeltaY, x2, y2, dir),
                strokeWidth: cm.lineWidth,
                stroke: lineColorOverride === ''
                    ? cm.lineColor
                    : lineColorOverride
            })
        }
        if (conditions.table) {
            // frame
            updateMapSvgData(cm.nodeId, 'tableFrame', {
                path: getArcPath(nsx, nsy, cm.selfW, cm.selfH, r, dir, 0),
                stroke: cm.sBorderColor === '' ? TABLE_FRAME_COLOR : cm.sBorderColor,
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
            updateMapSvgData(cm.nodeId, 'tableGrid', {
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
                            let sParams = {
                                ax: dir === - 1 ? sx + dir * w : sx,
                                bx: sx + dir*w,
                                cx: dir === - 1 ? sx : sx + dir * w,
                                ayu: sy,
                                ayd: sy + h,
                                byu: sy,
                                byd: sy + h,
                                cyu: sy,
                                cyd: sy + h,
                            }
                            updateMapSvgData(cm.nodeId, 'selectionBorder', {
                                path: getPolygonPath(sParams, 's', dir, 4),
                                stroke: SELECTION_COLOR,
                                strokeWidth: 1,
                            })
                            break tableLoops
                        }
                    }
                }
        }
        if (conditions.task) {
            const {mapWidth, margin, taskConfigN, taskConfigD, taskConfigGap, taskConfigWidth} = m
            let startX
            if (cm.path.includes('c')) {
                let coverCellPath = cm.path.slice(0, cm.path.lastIndexOf('c'))
                let currCol = cm.path[cm.path.lastIndexOf('c') + 2]
                let coverCellRef = mapref(m, coverCellPath)
                let smcv = coverCellRef.sumMaxColWidth[currCol]
                let mcv = coverCellRef.maxColWidth[currCol]
                startX = dir === - 1
                    ? coverCellRef.nodeEndX - smcv - mcv + 120
                    : coverCellRef.nodeStartX + smcv + mcv - 120
            } else {
                startX = dir === - 1
                    ? margin + taskConfigWidth
                    : mapWidth - taskConfigWidth - margin
            }
            let x1 = nex
            let x2 = startX
            let y = cm.nodeY
            if (!cm.isEditing) {
                updateMapSvgData(cm.nodeId, 'taskLine', {
                    path: `M${x1},${y} L${x2},${y}`,
                    stroke: TASK_LINE,
                    strokeWidth: 1,
                })
            }
            for (let i = 0; i < taskConfigN; i++) {
                const cx = dir === - 1
                    ? startX - taskConfigD/2 - i * (taskConfigD + taskConfigGap)
                    : startX + taskConfigD/2 + i * (taskConfigD + taskConfigGap)
                const cy = cm.nodeY
                const r = taskConfigD / 2
                const fill = cm.taskStatus === i
                    ? [TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE].at(i)
                    : [TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE].at(i)
                updateMapSvgData(cm.nodeId, `taskCircle${i}`, { cx, cy, r, fill })
            }
        }
        cm.d.map(i => mapVisualizeSvg.iterate(m, i, colorMode))
        cm.s.map(i => mapVisualizeSvg.iterate(m, i, colorMode))
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j, colorMode)))
    }
}
