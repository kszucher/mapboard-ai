import {genHash, copy, isOdd} from "../core/Utils";
import {mapState} from "../core/MapFlow";
import {mapSvgData, keepHash} from "../core/DomFlow";

let svgElementNameList = [
    'connectionLine',
    'branchHighlight',
    'tableFrame',
    'tableGrid',
    'cellFrame',
    'taskLine',
    'taskCircle0',
    'taskCircle1',
    'taskCircle2',
    'taskCircle3',
    'moveLine',
    'moveRect',
    'selectionRect',
];

export const mapSvgVisualize = {
    start: (r) => {
        // let mapSvgOuter2 = document.getElementById('mapSvgOuter2');
        // mapSvgOuter2.style.width = 'calc(200vw + ' + mapState.mapWidth + 'px)';
        // mapSvgOuter2.style.height = 'calc(200vh + ' + mapState.mapHeight + 'px)';

        let mapSvgOuter = document.getElementById('mapSvgOuter');
        mapSvgOuter.style.width = 'calc(200vw + ' + mapState.mapWidth + 'px)';
        mapSvgOuter.style.height = 'calc(200vh + ' + mapState.mapHeight + 'px)';
        mapSvgVisualize.iterate(r);
    },

    iterate: (cm) => {
        if (cm.twoStepAnimationRequested) {
            mapSvgVisualize.animate(cm, 0);
            cm.twoStepAnimationRequested = 0;
        } else {
            mapSvgVisualize.animate(cm, 1);
        }
        cm.d.map(i => mapSvgVisualize.iterate(i));
        cm.s.map(i => mapSvgVisualize.iterate(i));
        cm.c.map(i => i.map(j => mapSvgVisualize.iterate(j)));
    },

    animate: (cm, step) => {
        let svgElementData = {};
        let selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH;
        let maxHadj = isOdd(cm.maxH) ? cm.maxH + 1 : cm.maxH;
        // connectionLine
        if (!cm.isRoot && !cm.isRootChild && cm.parentType !== 'cell' && (
            cm.type === 'struct' && !cm.hasCell ||
            cm.type === 'cell' && cm.parentParentType !== 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {
            let x1, y1, x2, y2;
            if (step === 0) {
                x1 = cm.path[2]? cm.parentNodeStartXFrom : cm.parentNodeEndXFrom;
                y1 = cm.parentNodeYFrom;
            } else if (step === 1) {
                x1 = cm.path[2]? cm.parentNodeStartX : cm.parentNodeEndX;
                y1 = cm.parentNodeY;
            }
            x2 = cm.path[2]? cm.nodeEndX : cm.nodeStartX;
            y2 = cm.nodeY;
            svgElementData.connectionLine = {
                type: 'path',
                path: getConnectionLine(cm.lineType, x1, y1, cm.lineDeltaX, cm.lineDeltaY, x2, y2, cm.path[2]? -1 : 1),
                color: cm.lineColor,
                strokeWidth: cm.lineWidth,
            }
        }
        // branch
        // if (cm.hasBranchHighlight) {
        if (cm.content === 'Equations') {
            let ax = cm.path[2]? cm.nodeEndX : cm.nodeStartX;
            let bx = cm.path[2]? cm.nodeStartX - cm.lineDeltaX: cm.nodeEndX + cm.lineDeltaX;
            let cx = cm.path[2]? cm.nodeEndX - cm.familyW - cm.selfW: cm.nodeStartX + cm.familyW + cm.selfW;
            let ayu = cm.nodeY - selfHadj / 2;
            let ayd = cm.nodeY + selfHadj / 2;
            let bcyu = cm.nodeY - maxHadj / 2;
            let bcyd = cm.nodeY + maxHadj / 2;
            svgElementData.branchHighlight = {
                type: 'path',
                path: getRoundedPath([[ax,ayu],[bx,bcyu],[cx,bcyu],[cx,bcyd],[bx,bcyd],[ax,ayd]]),
                color: cm.lineColor,
                strokeWidth: cm.lineWidth,
            }
        }
        // table frame
        if (cm.type === "struct" && cm.hasCell) {
            let r = 8;
            let x1 = cm.path[2] ? cm.nodeEndX : cm.nodeStartX;
            let y1 = cm.nodeY - selfHadj / 2 + r;
            let h = cm.selfW - 2 * r;
            let v = cm.selfH - 2 * r;
            svgElementData.tableFrame = {
                type: 'path',
                path: getArc(x1, y1, h, v, r, cm.path[2]),
                color: cm.selected? '#000000' : cm.cBorderColor,
                strokeWidth: 1,
            };
        }
        // table grid
        if (cm.type === "struct" && cm.hasCell) {
            let path = '';
            let rowCount = Object.keys(cm.c).length;
            for (let i = 1; i < rowCount; i++) {
                let x1, y1, x2, y2;
                x1 = cm.nodeStartX;
                y1 = cm.nodeY - selfHadj/2 + cm.sumMaxRowHeight[i];
                x2 = cm.nodeEndX;
                y2 = cm.nodeY - selfHadj/2 + cm.sumMaxRowHeight[i];
                path += `M${x1},${y1} L${x2},${y2}`;
            }
            let colCount = Object.keys(cm.c[0]).length;
            for (let j = 1; j < colCount; j++) {
                let x1, y1, x2, y2;
                x1 = cm.path[2] ? cm.nodeEndX - cm.sumMaxColWidth[j] : cm.nodeStartX + cm.sumMaxColWidth[j];
                y1 = cm.nodeY - selfHadj/2;
                x2 = cm.path[2] ? cm.nodeEndX - cm.sumMaxColWidth[j] : cm.nodeStartX + cm.sumMaxColWidth[j];
                y2 = cm.nodeY + selfHadj/2;
                path += `M${x1},${y1} L${x2},${y2}`;
            }
            svgElementData.tableGrid = {
                type: 'path',
                path: path,
                color: '#dddddd',
                strokeWidth: 1,
            };
        }
        // table cell frame
        if (cm.type === 'cell' && cm.selected) {
            let r = 8;
            let x1 = cm.path[2]? cm.nodeEndX : cm.nodeStartX;
            let y1 = cm.nodeY - selfHadj / 2 + r;
            let h = cm.selfW - 2 * r;
            let v = cm.selfH - 2 * r;

            svgElementData.cellFrame = {
                type: 'path',
                path: getArc(x1, y1, h, v, r, cm.path[2]),
                color: '#000000',
                strokeWidth: 1,
            };
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
            let x1 = cm.path[2]? cm.nodeStartX : cm.nodeEndX;
            let y1 = cm.nodeY;
            let x2 = startX;
            let y2 = cm.nodeY;
            if (!cm.isEditing) {
                svgElementData.taskLine = {
                    type: 'path',
                    path: `M${x1},${y1} L${x2},${y2}`,
                    color: '#eeeeee',
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
        // move line
        if (cm.moveLine.length) {
            let x1, y1, c1x, c1y, c2x, c2y, x2, y2;
            let deltaX = cm.moveLine[2] - cm.moveLine[0];
            let deltaY = cm.moveLine[3] - cm.moveLine[1];
            x1 =    cm.moveLine[0];                 y1 =    cm.moveLine[1];
            c1x =   cm.moveLine[0] + deltaX / 4;    c1y =  cm.moveLine[1];
            c2x =   cm.moveLine[0] + deltaX / 4;    c2y =  cm.moveLine[1] + deltaY;
            x2 =    cm.moveLine[2];                 y2 =    cm.moveLine[3];
            svgElementData.moveLine = {
                type: 'path',
                path: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`,
                color: '#5f0a87',
                preventTransition: 1,
                strokeWidth: 1,
            }
        }
        // move rect
        if (cm.moveRect.length) {
            svgElementData.moveRect = {
                type: 'rect',
                x: cm.moveRect[0] - 10,
                y: cm.moveRect[1] - 10,
                width: 20,
                height: 20,
                rx: 8,
                ry: 8,
                fill: '#fbfafc',
                fillOpacity: 1,
                strokeWidth: 5,
            };
        }
        // selection rect
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
            };
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
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", svgElementData[svgElementName].type);
                    svgElement.setAttribute("id", svgElementName);
                    switch (svgElementData[svgElementName].type) {
                        case 'path': {
                            svgElement.setAttribute("d",                svgElementData[svgElementName].path);
                            svgElement.setAttribute("stroke",           svgElementData[svgElementName].color);
                            svgElement.setAttribute("stroke-width",     svgElementData[svgElementName].strokeWidth);
                            svgElement.setAttribute("fill",             "none");
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            svgElement.style.transition =               svgElementData[svgElementName].preventTransition ? '' : '0.5s ease-out';
                            svgElement.style.transitionProperty =       'd';
                            break;
                        }
                        case 'circle': {
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("r",                svgElementData[svgElementName].r);
                            svgElement.setAttribute("fill",             svgElementData[svgElementName].fill);
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            svgElement.style.transition =               '0.5s ease-out';
                            break;
                        }
                        case 'ellipse': {
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("rx",               svgElementData[svgElementName].rx);
                            svgElement.setAttribute("ry",               svgElementData[svgElementName].ry);
                            svgElement.setAttribute("fill",             '#5f0a87');
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            break;
                        }
                        case 'rect': {
                            svgElement.setAttribute("x",                svgElementData[svgElementName].x);
                            svgElement.setAttribute("y",                svgElementData[svgElementName].y);
                            svgElement.setAttribute("width",            svgElementData[svgElementName].width);
                            svgElement.setAttribute("height",           svgElementData[svgElementName].height);
                            svgElement.setAttribute("rx",               svgElementData[svgElementName].rx);
                            svgElement.setAttribute("ry",               svgElementData[svgElementName].ry);
                            svgElement.setAttribute("fill",             svgElementData[svgElementName].fill);
                            svgElement.setAttribute("fill-opacity",     svgElementData[svgElementName].fillOpacity);
                            svgElement.setAttribute("stroke",           '#5f0a87');
                            svgElement.setAttribute("stroke-width",      svgElementData[svgElementName].strokeWidth);
                            break;
                        }
                    }
                    svgGroup.appendChild(svgElement);
                    break;
                }
                case 'update': {
                    let svgElement = svgGroup.querySelector('#' + svgElementName);

                    switch (svgElementData[svgElementName].type) {
                        case 'path': {
                            svgElement.setAttribute("d",                svgElementData[svgElementName].path);
                            svgElement.setAttribute("stroke",           svgElementData[svgElementName].color);
                            svgElement.setAttribute("stroke-width",     svgElementData[svgElementName].strokeWidth);
                            break;
                        }
                        case 'circle': {
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("r",                svgElementData[svgElementName].r);
                            svgElement.setAttribute("fill",             svgElementData[svgElementName].fill);
                            break;
                        }
                        case 'ellipse': {
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            break;
                        }
                        case 'rect': {
                            svgElement.setAttribute("x",                svgElementData[svgElementName].x);
                            svgElement.setAttribute("y",                svgElementData[svgElementName].y);
                            svgElement.setAttribute("width",            svgElementData[svgElementName].width);
                            svgElement.setAttribute("height",           svgElementData[svgElementName].height);
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
        mapSvgData[cm.svgId].keepHash = keepHash;
        mapSvgData[cm.svgId].svgElementData = copy(svgElementData);
        mapSvgData[cm.svgId].path = cm.path;
    }
};

function getConnectionLine(lineType, sx, sy, dx, dy, ex, ey, dir) {
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

function getArc(x1, y1, h, v, r, dir) {
    if (dir === 0) {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 1 ${+r},${-r} h${+h} 
        a${+r},${+r} 0 0 1 ${+r},${+r} v${+v} 
        a${+r},${+r} 0 0 1 ${-r},${+r} h${-h} 
        a${+r},${+r} 0 0 1 ${-r},${-r}`
    } else {
        return `M${x1},${y1} 
        a${+r},${+r} 0 0 0 ${-r},${-r} h${-h} 
        a${+r},${+r} 0 0 0 ${-r},${+r} v${+v} 
        a${+r},${+r} 0 0 0 ${+r},${+r} h${+h} 
        a${+r},${+r} 0 0 0 ${+r},${-r}`
    }
}

function getRoundedPath(points) {
    let path = '';
    let radius = 14;
    for (let i = 0; i < points.length; i++) {
        let prevPoint = i === 0 ? points[points.length - 1] : points[i-1];
        let currPoint = points[i];
        let nextPoint = i === points.length - 1 ? points[0] : points[i+1];
        let [sx,sy] = getCoordsInLine(currPoint[0], currPoint[1], prevPoint[0], prevPoint[1], radius);
        let [c1x, c1y] = currPoint;
        let [c2x, c2y] = currPoint;
        let ex,ey; [ex,ey] = getCoordsInLine(currPoint[0], currPoint[1], nextPoint[0], nextPoint[1], radius);
        path += getBezierPath(i === 0 ? 'M' : 'L', [sx,sy,c1x,c1y,c2x,c2y,ex,ey]);
    }
    return path;
}

function getCoordsInLine(x0,y0,x1,y1,dt) {
    let xt,yt;
    let d = Math.sqrt(Math.pow((x1-x0),2)+Math.pow((y1-y0),2));
    let t = dt/d;
    xt = (1-t)*x0+t*x1;
    yt = (1-t)*y0+t*y1;
    return [xt, yt];
}

function getBezierPath(c, [x1,y1,c1x,c1y,c2x,c2y,x2,y2]) {
    return `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
}

function getEdgePath(c, [x1,y1,m1x,m1y,m2x,m2y,x2,y2]) {
    return `${c}${x1},${y1}, L${m1x},${m1y}, L${m2x},${m2y}, L${x2},${y2}`;
}
