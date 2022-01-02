import { COLORS, genHash, isChrome, isOdd } from '../core/Utils'
import { keepHash, mapSvgData, updateSvgDom } from '../core/DomFlow'
import { selectionState } from '../core/SelectionFlow'
import { resolveConditions } from '../core/DefaultProps'
import { mapref } from '../core/MapFlow'
import { getArcPath, getLinePath, getPolygonPath } from './MapVisualizeSvgUtils'
import { createMapSvgElementData } from './MapVisualizeSvgM'

export const mapVisualizeSvg = {
    start: (m, cr) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + m.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + m.mapHeight + 'px)';
        mapVisualizeSvg.iterate(m, cr);
    },

    iterate: (m, cm) => {
        let animationInit = '';
        if (cm.lineAnimationRequested) {
            cm.lineAnimationRequested = 0;
            animationInit = 'l';
        }
        let svgElementData = [{},{},{},{},{},{}];









        createMapSvgElementData(m, cm, svgElementData)












        let conditions = resolveConditions(cm);


        let selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH;
        let maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH;
        let nsx = cm.path[3] ? cm.nodeEndX : cm.nodeStartX;
        let nex = cm.path[3] ? cm.nodeStartX : cm.nodeEndX;
        let nsy = cm.nodeY - selfHadj/2;
        let ney = cm.nodeY + selfHadj/2;
        let dir = cm.path[3] ? -1 : 1;
        let r = 8;



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
                svgElementData[1].branchFill = {
                    type: 'path',
                    path: getPolygonPath(fParams, 'f', dir, 0),
                    fill: cm.ellipseBranchFillColor,
                }
            }
            if (conditions.nodeFill) {
                svgElementData[2].nodeFill = {
                    type: 'path',
                    path: getPolygonPath(sParams, 's', dir, 0),
                    fill: cm.ellipseNodeFillColor,
                }
            }
            if (conditions.branchBorder) {
                svgElementData[3].branchBorder = {
                    type: 'path',
                    path: getPolygonPath(fParams, 'f', dir, 0), // margin will depend on stroke width
                    stroke: cm.ellipseBranchBorderColor,
                    strokeWidth: cm.ellipseBranchBorderWidth,
                }
            }
            if (conditions.nodeBorder) {
                svgElementData[3].nodeBorder = {
                    type: 'path',
                    path: getPolygonPath(sParams, 's', dir, 0), // margin will depend on stroke width
                    stroke: cm.ellipseNodeBorderColor,
                    strokeWidth: cm.ellipseNodeBorderWidth,
                }
            }
            if (conditions.selectionBorder) {
                svgElementData[4].selectionBorder = {
                    type: 'path',
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
                }
            }
            if (conditions.selectionBorderTable) {
                svgElementData[4].selectionBorderTable = {
                    type: 'path',
                    path: getArcPath(nsx, nsy, cm.selfW, cm.selfH, r, dir, 4),
                    stroke: '#666666',
                    strokeWidth: 1,
                };
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
            svgElementData[3].line = {
                type: 'path',
                path: getLinePath(cm.lineType, x1, y1, cm.lineDeltaX, cm.lineDeltaY, x2, y2, dir),
                stroke: cm.lineColor,
                strokeWidth: cm.lineWidth,
            }
        }
        if (conditions.table) {
            // frame
            svgElementData[3].tableFrame = {
                type: 'path',
                path: getArcPath(nsx, nsy, cm.selfW, cm.selfH, r, dir, 0),
                stroke: cm.cBorderColor,
                strokeWidth: cm.ellipseNodeBorderWidth,
            };
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
            svgElementData[3].tableGrid = {
                type: 'path',
                path: path,
                stroke: '#dddddd',
                strokeWidth: 1,
            };
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
                        svgElementData[3].tableCellFrame = {
                            type: 'path',
                            path: getArcPath(sx, sy, w, h, r, dir, 0),
                            stroke: '#000000',
                            strokeWidth: 1,
                        };
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
                svgElementData[3].taskLine = {
                    type: 'path',
                    path: `M${x1},${y} L${x2},${y}`,
                    stroke: '#eeeeee',
                    strokeWidth: 1,
                };
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
                svgElementData[3]['taskCircle' + i] = {
                    type: 'circle',
                    cx: centerX,
                    cy: centerY,
                    r: taskConfigD/2,
                    fill: fill,
                };
            }
        }





        let svgGroupList = [];
        if (!mapSvgData.hasOwnProperty(cm.svgId) ||
            ((mapSvgData.hasOwnProperty(cm.svgId) && mapSvgData[cm.svgId].keepHash === keepHash))) {
            if (cm.svgId === '') {
                cm.svgId = 'svg' + genHash(8);
            }
            for (const i of [0,1,2,3,4,5]) {
                mapSvgData[cm.svgId] = {
                    svgElementData: [{},{},{},{},{},{}],
                    path: [],
                };
                svgGroupList.push(document.createElementNS("http://www.w3.org/2000/svg", "g"));
                svgGroupList[i].setAttribute("id", cm.svgId + i);
                let parentG = document.getElementById('layer' + i);
                parentG.appendChild(svgGroupList[i]);
            }
        } else {
            for (const i of [0,1,2,3,4,5]) {
                svgGroupList.push(document.getElementById(cm.svgId + i));
            }
        }

        updateSvgDom(cm.svgId, svgElementData, svgGroupList)

        let {path} = cm;
        Object.assign(mapSvgData[cm.svgId], {keepHash, svgElementData, path})
        cm.d.map(i => mapVisualizeSvg.iterate(m, i));
        cm.s.map(i => mapVisualizeSvg.iterate(m, i));
        cm.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j)));
    }
};
