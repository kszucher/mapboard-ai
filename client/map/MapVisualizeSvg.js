import { updateMapSvgData } from '../core/DomFlow'
import { COLORS, isOdd } from '../core/Utils'
import { resolveConditions } from '../core/DefaultProps'
import { selectionState } from '../core/SelectionFlow'
import { mapref } from '../core/MapFlow'

const getCoordsInLine = (a, b, dt) => {
    let [x0, y0] = a
    let [x1, y1] = b
    let xt, yt
    let d = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
    let t = dt / d
    xt = (1 - t) * x0 + t * x1
    yt = (1 - t) * y0 + t * y1
    return [xt, yt]
}

const getBezierPath  = (c, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]) => {
    return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`
}

const getEdgePath = (c, [x1, y1, m1x, m1y, m2x, m2y, x2, y2]) => {
    return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`
}

const getLinePath = (lineType, sx, sy, dx, dy, ex, ey, dir) => {
    let path
    if (lineType === 'b') {
        let c1x = sx + dir * dx / 4
        let c1y = sy
        let c2x = sx + dir * dx / 4
        let c2y = sy + dy
        path = getBezierPath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
    } else if (lineType === 'e') {
        let m1x = sx + dir * dx / 2
        let m1y = sy
        let m2x = sx + dir * dx / 2
        let m2y = sy + dy
        path = getEdgePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey])
    }
    return path
}

const getPolygonPath = (params, selection, dir, margin) => {
    let { ax, bx, cx, ayu, ayd, bcyu, bcyd } = params
    ax -= dir * margin
    bx -= dir * margin
    cx += dir * margin
    ayu -= margin
    ayd += margin
    bcyu -= margin
    bcyd += margin
    let points = [[ax, ayu], [bx, bcyu], [cx, bcyu], [cx, bcyd], [bx, bcyd], [ax, ayd]]
    let path = ''
    let radius = 12
    for (let i = 0; i < points.length; i++) {
        let prevPoint = i === 0 ? points[points.length - 1] : points[i - 1]
        let currPoint = points[i]
        let nextPoint = i === points.length - 1 ? points[0] : points[i + 1]
        let [sx, sy] = getCoordsInLine(currPoint, prevPoint, radius)
        let [c1x, c1y] = currPoint
        let [c2x, c2y] = currPoint
        let [ex, ey] = getCoordsInLine(currPoint, nextPoint, radius)
        if (selection === 's' && i === 1) {
            path += getBezierPath('L', [sx, sy, sx, sy, sx, sy, ex - dir * 24, ey])
        } else if (selection === 's' && i === 4) {
            path += getBezierPath('L', [sx - dir * 24, sy, ex, ey, ex, ey, ex, ey])
        } else {
            path += getBezierPath(i === 0 ? 'M' : 'L', [sx, sy, c1x, c1y, c2x, c2y, ex, ey])
        }
    }
    return path + 'z'
}

const getArcPath = (sx, sy, w, h, r, dir, margin) => {
    let x1 = sx - margin*dir;
    let y1 = sy + r - margin;
    let horz = w - 2*r + 2*margin;
    let vert = h - 2*r + 2*margin;
    if (dir === 1) {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 1 ${+r},${-r} h${+horz}
        a${+r},${+r} 0 0 1 ${+r},${+r} v${+vert}
        a${+r},${+r} 0 0 1 ${-r},${+r} h${-horz}
        a${+r},${+r} 0 0 1 ${-r},${-r}`
    } else {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 0 ${-r},${-r} h${-horz} 
        a${+r},${+r} 0 0 0 ${-r},${+r} v${+vert} 
        a${+r},${+r} 0 0 0 ${+r},${+r} h${+horz} 
        a${+r},${+r} 0 0 0 ${+r},${-r}`
    }
}

export const mapVisualizeSvg = {
    start: (m, cr) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)';
        const {nodeId} = m
        updateMapSvgData(nodeId, 'backgroundRect', {
            x: 0,
            y: 0,
            width: m.mapWidth,
            height: m.mapHeight,
            rx: 32,
            ry: 32,
            fill: COLORS.MAP_BACKGROUND,
        })
        if (m.moveData?.length) {
            let x1, y1, c1x, c1y, c2x, c2y, x2, y2;
            let deltaX = m.moveData[2] - m.moveData[0];
            let deltaY = m.moveData[3] - m.moveData[1];
            // the elegant solution would be the inheritance of the target line type
            x1 = m.moveData[0];
            y1 = m.moveData[1];
            c1x = m.moveData[0] + deltaX / 4;
            c1y = m.moveData[1];
            c2x = m.moveData[0] + deltaX / 4;
            c2y = m.moveData[1] + deltaY;
            x2 = m.moveData[2];
            y2 = m.moveData[3];
            updateMapSvgData(nodeId, 'moveLine', {
                path: getBezierPath('M', [x1, y1, c1x, c1y, c2x, c2y, x2, y2]),
                stroke: '#5f0a87',
                strokeWidth: 1,
                preventTransition: 1,
            })
            updateMapSvgData(nodeId, 'moveRect', {
                x: m.moveData[2] - 10,
                y: m.moveData[3] - 10,
                width: 20,
                height: 20,
                rx: 8,
                ry: 8,
                fill: COLORS.MAP_BACKGROUND,
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
        mapVisualizeSvg.iterate(m, cr);
    },

    iterate: (m, cm) => {
        const {nodeId} = cm
        const conditions = resolveConditions(cm);
        const selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH;
        const maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH;
        const nsx = cm.path[3] ? cm.nodeEndX : cm.nodeStartX;
        const nex = cm.path[3] ? cm.nodeStartX : cm.nodeEndX;
        const nsy = cm.nodeY - selfHadj/2;
        const ney = cm.nodeY + selfHadj/2;
        const dir = cm.path[3] ? -1 : 1;
        const r = 8;
        let animationInit = '';
        if (cm.lineAnimationRequested) {
            cm.lineAnimationRequested = 0;
            animationInit = 'l';
        }
        if (conditions.branchFill ||
            conditions.nodeFill ||
            conditions.branchBorder ||
            conditions.nodeBorder ||
            conditions.selectionBorder ||
            conditions.selectionBorderTable) {
            let corr = dir === -1 ? -1 : 0;
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
                    fill: cm.ellipseBranchFillColor,
                })
            }
            if (conditions.nodeFill) {
                updateMapSvgData(nodeId, 'nodeFill', {
                    path: getPolygonPath(sParams, 's', dir, 0),
                    fill: cm.ellipseNodeFillColor,
                })
            }
            if (conditions.branchBorder) {
                updateMapSvgData(nodeId, 'branchBorder', {
                    path: getPolygonPath(fParams, 'f', dir, 0), // margin will depend on stroke width
                    stroke: cm.ellipseBranchBorderColor,
                    strokeWidth: cm.ellipseBranchBorderWidth,
                })
            }
            if (conditions.nodeBorder) {
                updateMapSvgData(nodeId, 'nodeBorder', {
                    path: getPolygonPath(sParams, 's', dir, 0), // margin will depend on stroke width
                    stroke: cm.ellipseNodeBorderColor,
                    strokeWidth: cm.ellipseNodeBorderWidth,
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
                            ? cm.ellipseNodeBorderColor !== '' ? 4 : 0
                            : cm.ellipseBranchBorderColor !== '' ? 4 : 0
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
            let x1, y1, x2, y2;
            if (animationInit === 'l') {
                x1 = cm.path[3] ? cm.parentNodeStartXFrom : cm.parentNodeEndXFrom;
                y1 = cm.parentNodeYFrom;
            } else {
                x1 = cm.path[3] ? cm.parentNodeStartX : cm.parentNodeEndX;
                y1 = cm.parentNodeY;
            }
            x1 = isOdd(x1)?x1-0.5:x1;
            x2 = nsx;
            y2 = cm.nodeY;
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
                strokeWidth: cm.ellipseNodeBorderWidth,
            })
            // grid
            let path = '';
            let rowCount = Object.keys(cm.c).length;
            for (let i = 1; i < rowCount; i++) {
                let x1 = cm.nodeStartX;
                let x2 = cm.nodeEndX;
                let y = nsy + cm.sumMaxRowHeight[i];
                path += `M${x1},${y} L${x2},${y}`;
            }
            let colCount = Object.keys(cm.c[0]).length;
            for (let j = 1; j < colCount; j++) {
                let x = nsx + dir*cm.sumMaxColWidth[j];
                path += `M${x},${nsy} L${x},${ney}`;
            }
            updateMapSvgData(nodeId, 'tableGrid', {
                path: path,
                stroke: '#dddddd',
                strokeWidth: 1,
            })
            // cell
            for (let i = 0; i < rowCount; i++) {
                for (let j = 0; j < colCount; j++) {
                    if (cm.c[i][j].selected) {
                        let sx, sy, w, h;
                        let sc = selectionState;
                        if (sc.cellRowSelected) {
                            sx = nsx;
                            sy = nsy + cm.sumMaxRowHeight[i];
                            w = cm.selfW;
                            h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i];
                        } else if (sc.cellColSelected) {
                            sx = nsx + dir*cm.sumMaxColWidth[j];
                            sy = nsy;
                            w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j];
                            h = cm.selfH;
                        } else {
                            sx = nsx + dir*cm.sumMaxColWidth[j];
                            sy = nsy + cm.sumMaxRowHeight[i];
                            w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j];
                            h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i];
                        }
                        updateMapSvgData(nodeId, 'tableCellFrame', {
                            path: getArcPath(sx, sy, w, h, r, dir, 0),
                            stroke: '#000000',
                            strokeWidth: 1,
                        })
                        break;
                    }
                }
            }
        }
        if (conditions.task) {
            let {mapWidth, margin, taskConfigN, taskConfigD, taskConfigGap, taskConfigWidth} = m;
            let startX;
            if (cm.path.includes('c')) {
                let coverCellPath = cm.path.slice(0, cm.path.lastIndexOf('c'));
                let currCol = cm.path[cm.path.lastIndexOf('c') + 2]
                let coverCellRef = mapref(coverCellPath);
                let smcv = coverCellRef.sumMaxColWidth[currCol];
                let mcv = coverCellRef.maxColWidth[currCol];
                startX = cm.path[3]
                    ? coverCellRef.nodeEndX - smcv - mcv + 120
                    : coverCellRef.nodeStartX + smcv + mcv - 120;
            } else {
                startX = cm.path[3] ? margin + taskConfigWidth : mapWidth - taskConfigWidth - margin
            }
            let x1 = nex;
            let x2 = startX;
            let y = cm.nodeY;
            if (!cm.isEditing) {
                updateMapSvgData(nodeId, 'taskLine', {
                    path: `M${x1},${y} L${x2},${y}`,
                    stroke: '#eeeeee',
                    strokeWidth: 1,
                })
            }
            for (let i = 0; i < taskConfigN; i++) {
                let centerX = cm.path[3]
                    ? startX - taskConfigD/2 - i * (taskConfigD + taskConfigGap)
                    : startX + taskConfigD/2 + i * (taskConfigD + taskConfigGap);
                let centerY = cm.nodeY;
                let fill;
                if (cm.taskStatus === i) {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break;
                        case 1: fill = '#2c9dfc'; break;
                        case 2: fill = '#d5802a'; break;
                        case 3: fill = '#25bf25'; break;
                    }
                } else {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break;
                        case 1: fill = '#e5f3fe'; break;
                        case 2: fill = '#f6e5d4'; break;
                        case 3: fill = '#e5f9e5'; break;
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
        cm.d.map(i => mapVisualizeSvg.iterate(m, i));
        cm.s.map(i => mapVisualizeSvg.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j)));
    }
}
