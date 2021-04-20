import {copy, genHash, isOdd} from "../core/Utils";
import {mapState} from "../core/MapFlow";
import {keepHash, mapSvgData} from "../core/DomFlow";
import {selectionState} from "../core/SelectionFlow";

let svgElementNameList = [
    'backgroundRect',
    'selectionRect',
    'moveLine',
    'moveRect',
    'connectionLine',
    'connectionCircle',
    'highlightPolygon',
    'selectionPolygon',
    'tableFrame',
    'tableGrid',
    'tableCellFrame',
    'taskLine',
    'taskCircle0',
    'taskCircle1',
    'taskCircle2',
    'taskCircle3',
];

export const mapSvgVisualize = {
    start: (r) => {
        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + mapState.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + mapState.mapHeight + 'px)';
        mapSvgVisualize.iterate(r);
    },

    iterate: (cm) => {
        let svgElementData = {};
        let selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH;
        let maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH;
        let nsx = cm.path[2]? cm.nodeEndX : cm.nodeStartX;
        let nex = cm.path[2]? cm.nodeStartX : cm.nodeEndX;
        let nsy = cm.nodeY - selfHadj/2;
        let ney = cm.nodeY + selfHadj/2;
        let dir = cm.path[2]? -1 : 1;
        // backgroundRect
        if (cm.isRoot) {
            svgElementData.backgroundRect = {
                type: 'rect',
                x: 0,
                y: 0,
                width: mapState.mapWidth,
                height: mapState.mapHeight,
                rx: 32,
                ry: 32,
                fill: '#fbfafc',
            };
        }
        // selectionRect
        if (cm.selectionRect.length) {
            svgElementData.selectionRect = {
                type: 'rect',
                x: cm.selectionRect[0],
                y: cm.selectionRect[1],
                width: cm.selectionRect[2],
                height: cm.selectionRect[3],
                rx: 8,
                ry: 8,
                fill: '#5f0a87',
                fillOpacity: 0.05,
                strokeWidth: 2,
                preventTransition: 1,
            };
        }
        // moveLine, moveRect
        if (cm.moveData.length) {
            let x1, y1, c1x, c1y, c2x, c2y, x2, y2;
            let deltaX = cm.moveData[2] - cm.moveData[0];
            let deltaY = cm.moveData[3] - cm.moveData[1];
            // the elegant solution would be the inheritance of the target line type
            x1 = cm.moveData[0];
            y1 = cm.moveData[1];
            c1x = cm.moveData[0] + deltaX / 4;
            c1y = cm.moveData[1];
            c2x = cm.moveData[0] + deltaX / 4;
            c2y = cm.moveData[1] + deltaY;
            x2 = cm.moveData[2];
            y2 = cm.moveData[3];
            svgElementData.moveLine = {
                type: 'path',
                path: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`,
                stroke: '#5f0a87',
                strokeWidth: 1,
                preventTransition: 1,
            }
            svgElementData.moveRect = {
                type: 'rect',
                x: cm.moveData[2] - 10,
                y: cm.moveData[3] - 10,
                width: 20,
                height: 20,
                rx: 8,
                ry: 8,
                fill: '#fbfafc',
                fillOpacity: 1,
                stroke: '#5f0a87',
                strokeWidth: 5,
                preventTransition: 1,
            };
        }
        // connectionLine
        if (!cm.isRoot && !cm.isRootChild && cm.parentType !== 'cell' && (
            cm.type === 'struct' && !cm.hasCell ||
            cm.type === 'cell' && cm.parentParentType !== 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {
            let x1, y1, x2, y2;
            if (cm.lineAnimationRequested) {
                cm.lineAnimationRequested = 0;
                x1 = cm.path[2]? cm.parentNodeStartXFrom : cm.parentNodeEndXFrom;
                y1 = cm.parentNodeYFrom;
            } else {
                x1 = cm.path[2] ? cm.parentNodeStartX : cm.parentNodeEndX;
                y1 = cm.parentNodeY;
            }
            x1 = isOdd(x1)?x1-0.5:x1;
            x2 = nsx;
            y2 = cm.nodeY;
            svgElementData.connectionLine = {
                type: 'path',
                path: getLinePath(cm.lineType, x1, y1, cm.lineDeltaX, cm.lineDeltaY, x2, y2, dir),
                stroke: cm.lineColor,
                strokeWidth: cm.lineWidth,
            }
        }
        if (cm.lineType === 'bc' && cm.s.length > 0) {
            let x1, y1;
            x1 = nex;
            y1 = cm.nodeY;
            svgElementData.connectionCircle = {
                type: 'circle',
                cx: x1 + dir*4,
                cy: y1,
                r: 4,
                fill: cm.lineColor,
            }
        }
        // selectionPolygon, highlightPolygon
        if (cm.ellipseFillColor!== '' || cm.selected && !cm.isEditing) {
            let corr = dir === -1 ? -1 : 0;
            let margin = 2;
            let sParams = {
                ax: nsx + 1 * dir + corr,
                bx: nex - 2 * dir + corr - dir,
                cx: nex - 2 * dir + corr,
                ayu: nsy + 1,
                ayd: ney - 3,
                bcyu: nsy + 1,
                bcyd: ney - 3,
            }
            let fParams = {
                ax: nsx + corr,
                bx: nex + dir * cm.lineDeltaX + corr,
                cx: nsx + dir * (cm.familyW + cm.selfW + margin),
                ayu: nsy,
                ayd: ney,
                bcyu: cm.nodeY - maxHadj / 2 - margin,
                bcyd: cm.nodeY + maxHadj / 2 + margin,
            }
            if (cm.ellipseFillColor!== '') {
                svgElementData.highlightPolygon = {
                    type: 'path',
                    path: getPolygonPath(getPolygonPoints(sParams), 'self', dir),
                    stroke:  'none',
                    fill: cm.ellipseFillColor,
                }
            }
            if (cm.selected && !cm.isEditing) {
                svgElementData.selectionPolygon = {
                    type: 'path',
                    path: getPolygonPath(getPolygonPoints(cm.selection  === 's' ? sParams : fParams), cm.selection, dir),
                    stroke: '#666666',
                    strokeWidth: cm.lineWidth,
                }
            }
        }
        // table
        if (cm.type === "struct" && cm.hasCell) {
            // frame
            let r = 8;
            let x1 = nsx;
            let y1 = nsy;
            let w = cm.selfW;
            let h = cm.selfH;
            svgElementData.tableFrame = {
                type: 'path',
                path: getArcPath(x1, y1, w, h, r, cm.path[2]),
                stroke: cm.selected? '#000000' : cm.cBorderColor,
                strokeWidth: 1,
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
            svgElementData.tableGrid = {
                type: 'path',
                path: path,
                stroke: '#dddddd',
                strokeWidth: 1,
            };
            // cell
            for (let i = 0; i < rowCount; i++) {
                for (let j = 0; j < colCount; j++) {
                    if (cm.c[i][j].selected) {
                        let x1, y1, w, h;
                        let sc = selectionState;
                        if (sc.cellRowSelected) {
                            x1 = nsx;
                            y1 = nsy + cm.sumMaxRowHeight[i];
                            w = cm.selfW;
                            h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i];
                        } else if (sc.cellColSelected) {
                            x1 = nsx + dir*cm.sumMaxColWidth[j];
                            y1 = nsy;
                            w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j];
                            h = cm.selfH;
                        } else {
                            x1 = nsx + dir*cm.sumMaxColWidth[j];
                            y1 = nsy + cm.sumMaxRowHeight[i];
                            w = cm.sumMaxColWidth[j+1] - cm.sumMaxColWidth[j];
                            h = cm.sumMaxRowHeight[i+1] - cm.sumMaxRowHeight[i];
                        }
                        svgElementData.tableCellFrame = {
                            type: 'path',
                            path: getArcPath(x1, y1, w, h, r, cm.path[2]),
                            stroke: '#000000',
                            strokeWidth: 1,
                        };
                        break;
                    }
                }
            }
        }
        // task
        if (cm.task &&
            !cm.path.includes('c') &&
            !cm.hasDir &&
            !cm.hasStruct &&
            !cm.hasCell &&
            cm.parentType !== 'cell' &&
            cm.contentType !== 'image' &&
            !cm.isRoot &&
            !cm.isRootChild) {
            let {mapWidth, margin} = mapState;
            let {n, d, gap, width} = mapState.taskConfig;
            let startX = cm.path[2]? margin + width : mapWidth - width - margin;
            let x1 = nex;
            let x2 = startX;
            let y = cm.nodeY;
            if (!cm.isEditing) {
                svgElementData.taskLine = {
                    type: 'path',
                    path: `M${x1},${y} L${x2},${y}`,
                    stroke: '#eeeeee',
                    strokeWidth: 1,
                };
            }
            for (let i = 0; i < n; i++) {
                let centerX = cm.path[2]? startX - d/2 - i * (d + gap) : startX + d/2 + i * (d + gap);
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
                let r = d/2;
                svgElementData['taskCircle' + i] = {
                    type: 'circle',
                    cx: centerX,
                    cy: centerY,
                    r,
                    fill: fill,
                };
            }
        }
        let svgGroup;
        if (!mapSvgData.hasOwnProperty(cm.svgId) ||
            ((mapSvgData.hasOwnProperty(cm.svgId) && mapSvgData[cm.svgId].keepHash === keepHash))) {
            cm.svgId = 'svg' + genHash(8);
            mapSvgData[cm.svgId] = {
                svgElementData: {},
                path: [],
            };
            svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svgGroup.setAttribute("id", cm.svgId);
            let mapSvg = document.getElementById('mapSvgInner');
            mapSvg.appendChild(svgGroup);
        } else {
            svgGroup = document.getElementById(cm.svgId);
        }
        for (const svgElementName of svgElementNameList) {
            let hadBefore = mapSvgData[cm.svgId].svgElementData.hasOwnProperty(svgElementName);
            let hasNow = svgElementData.hasOwnProperty(svgElementName);
            let op = '';
            if (hadBefore === false && hasNow === true) op = 'init';
            if (hadBefore === true && hasNow === false) op = 'delete';
            if (hadBefore === true && hasNow === true) {
                if (JSON.stringify(svgElementData[svgElementName]) !==
                    JSON.stringify(mapSvgData[cm.svgId].svgElementData[svgElementName])) {
                    op = 'update';
                }
            }
            switch (op) {
                case 'init': {
                    let {type} = svgElementData[svgElementName]
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", type);
                    svgElement.setAttribute("id", svgElementName);
                    switch (type) {
                        case 'path': {
                            let {path, stroke, strokeWidth, fill, preventTransition} = svgElementData[svgElementName];
                            svgElement.setAttribute("d", path);
                            svgElement.setAttribute("stroke", stroke);
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            svgElement.setAttribute("fill", (fill && fill !== '') ? fill : "none");
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke");
                            svgElement.style.transition = preventTransition ? '' : '0.5s ease-out';
                            svgElement.style.transitionProperty = 'd';
                            break;
                        }
                        case 'circle': {
                            let {cx, cy, r, fill} = svgElementData[svgElementName];
                            svgElement.setAttribute("cx", cx);
                            svgElement.setAttribute("cy", cy);
                            svgElement.setAttribute("r", r);
                            svgElement.setAttribute("fill", fill);
                            svgElement.setAttribute("vector-effect", "non-scaling-stroke");
                            svgElement.style.transition = '0.5s ease-out';
                            break;
                        }
                        case 'rect': {
                            let {x, y, width, height, rx, ry, fill, fillOpacity, stroke, strokeWidth, preventTransition} = svgElementData[svgElementName];
                            svgElement.setAttribute("x", x);
                            svgElement.setAttribute("y", y);
                            svgElement.setAttribute("width", width);
                            svgElement.setAttribute("height", height);
                            svgElement.setAttribute("rx", rx);
                            svgElement.setAttribute("ry", ry);
                            svgElement.setAttribute("fill", fill);
                            svgElement.setAttribute("fill-opacity", fillOpacity);
                            svgElement.setAttribute("stroke", (stroke && stroke !== '') ? stroke: 'none');
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            svgElement.style.transition = preventTransition ? '' : '0.5s ease-out';
                            break;
                        }
                    }
                    svgGroup.appendChild(svgElement);
                    break;
                }
                case 'update': {
                    let {type} = svgElementData[svgElementName];
                    let svgElement = svgGroup.querySelector('#' + svgElementName);
                    switch (type) {
                        case 'path': {
                            let {path, stroke, strokeWidth} = svgElementData[svgElementName];
                            svgElement.setAttribute("d", path);
                            svgElement.setAttribute("stroke", stroke);
                            svgElement.setAttribute("stroke-width", strokeWidth);
                            break;
                        }
                        case 'circle': {
                            let {cx, cy, r, fill} = svgElementData[svgElementName];
                            svgElement.setAttribute("cx", cx);
                            svgElement.setAttribute("cy", cy);
                            svgElement.setAttribute("r", r);
                            svgElement.setAttribute("fill", fill);
                            break;
                        }
                        case 'rect': {
                            let {x, y, width, height} = svgElementData[svgElementName];
                            svgElement.setAttribute("x", x);
                            svgElement.setAttribute("y", y);
                            svgElement.setAttribute("width", width);
                            svgElement.setAttribute("height", height);
                            break;
                        }
                    }
                    break;
                }
                case 'delete': {
                    let svgElement = svgGroup.querySelector('#' + svgElementName);
                    svgElement.parentNode.removeChild(svgElement);
                    break;
                }
            }
        }
        let {path} = cm;
        Object.assign(mapSvgData[cm.svgId], {keepHash, svgElementData, path})
        cm.d.map(i => mapSvgVisualize.iterate(i));
        cm.s.map(i => mapSvgVisualize.iterate(i));
        cm.c.map(i => i.map(j => mapSvgVisualize.iterate(j)));
    }
};

function getArcPath(sx, sy, w, h, r, dir) {
    let x1 = sx;
    let y1 = sy + r;
    let horz = w - 2 * r;
    let vert = h - 2 * r;
    if (dir === 0) {
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

function getLinePath(lineType, sx, sy, dx, dy, ex, ey, dir) {
    let path;
    if (lineType === 'b') {
        let c1x = sx + dir * dx / 4;
        let c1y = sy;
        let c2x = sx + dir * dx / 4;
        let c2y = sy + dy;
        path = getBezierPath('M', [sx, sy, c1x, c1y, c2x, c2y, ex, ey]);
    } else if (lineType === 'bc') {
        let sxn = sx + dir*15;
        let dxn  = dx / 2;
        let c1x =  sxn + dir * dxn;
        let c1y =  sy;
        let c2x =  sxn + dir * dxn / 4;
        let c2y =  sy + dy;
        path = `M${sx},${sy} L${sxn},${sy} ` + getBezierPath('M', [sxn, sy, c1x, c1y, c2x, c2y, ex, ey]);
    } else if (lineType === 'e') {
        let m1x =  sx + dir * dx / 2;
        let m1y =  sy;
        let m2x =  sx + dir * dx / 2;
        let m2y =  sy + dy;
        path = getEdgePath('M', [sx, sy, m1x, m1y, m2x, m2y, ex, ey]);
    }
    return path;
}

function getPolygonPath(points, selection, dir) {
    let path = '';
    let radius = 16;
    for (let i = 0; i < points.length; i++) {
        let prevPoint = i === 0 ? points[points.length - 1] : points[i-1];
        let currPoint = points[i];
        let nextPoint = i === points.length - 1 ? points[0] : points[i+1];
        let [sx,sy] = getCoordsInLine(currPoint[0], currPoint[1], prevPoint[0], prevPoint[1], radius);
        let [c1x, c1y] = currPoint;
        let [c2x, c2y] = currPoint;
        let [ex,ey] = getCoordsInLine(currPoint[0], currPoint[1], nextPoint[0], nextPoint[1], radius);
        if (selection === 's' && i===1) {
            path += getBezierPath('L', [sx,sy,sx,sy,sx,sy,ex-dir*32,ey]);
        } else if (selection === 's' && i===4) {
            path += getBezierPath('L', [sx-dir*32,sy,ex,ey,ex,ey,ex,ey]);
        } else {
            path += getBezierPath(i === 0 ? 'M' : 'L', [sx,sy,c1x,c1y,c2x,c2y,ex,ey]);
        }
    }
    return path + 'z';
}

function getPolygonPoints (params) {
    let {ax, bx, cx, ayu, ayd, bcyu, bcyd} = params;
    return [[ax, ayu], [bx, bcyu], [cx, bcyu], [cx, bcyd], [bx, bcyd], [ax, ayd]];
}

function getBezierPath(c, [x1,y1,c1x,c1y,c2x,c2y,x2,y2]) {
    return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
}

function getEdgePath(c, [x1,y1,m1x,m1y,m2x,m2y,x2,y2]) {
    return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`;
}

function getCoordsInLine(x0,y0,x1,y1,dt) {
    let xt,yt;
    let d = Math.sqrt(Math.pow((x1-x0),2)+Math.pow((y1-y0),2));
    let t = dt/d;
    xt = (1-t)*x0+t*x1;
    yt = (1-t)*y0+t*y1;
    return [xt, yt];
}
