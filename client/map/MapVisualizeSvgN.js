import { resolveConditions } from '../core/DefaultProps'
import { isOdd } from '../core/Utils'
import { getArcPath, getLinePath, getPolygonPath } from './MapVisualizeSvgUtils'
import { selectionState } from '../core/SelectionFlow'
import { mapref } from '../core/MapFlow'
import { updateMapSvgData } from '../core/DomFlow'

export const createNodeSvgElementData = (m, cm) => {
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
}
