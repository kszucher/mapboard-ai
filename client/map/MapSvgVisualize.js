import {keepHash, mapMem, mapSvgData} from "./Map";
import {genHash, copy, isOdd} from "../core/Utils";

let svgElementNameList = [
    'connection',
    'tableGrid',
    'tableFrame',
    'cellFrame',
    'taskLine',
    'taskCircle0',
    'taskCircle1',
    'taskCircle2',
    'taskCircle3',
    'moveEllipse'
];

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.getData().r;
        mapSvgVisualize.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.twoStepAnimationRequested) {
            mapSvgVisualize.animate(cm, 0);
            cm.twoStepAnimationRequested = 0;
        }
        else {
            mapSvgVisualize.animate(cm, 1);
        }

        cm.d.map(i => mapSvgVisualize.iterate(i));
        cm.s.map(i => mapSvgVisualize.iterate(i));
        cm.c.map(i => i.map(j => mapSvgVisualize.iterate(j)));
    },

    animate: (cm, step) => {

        let svgElementData = {};
        let selfHadj = isOdd(cm.selfH) ? cm.selfH + 1 : cm.selfH;

        // connection
        if (!cm.isRoot && !cm.isRootChild && cm.parentType !== 'cell' && (
            cm.type === 'struct' && !cm.hasCell ||
            cm.type === 'cell' && cm.parentParentType !== 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {
            let x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2;
            if (step === 0) {
                if (cm.path[2] === 0) {
                    x1 =    cm.parentNodeEndXFrom;                          y1 =    cm.parentNodeEndYFrom;
                    cp1x =  cm.parentNodeEndXFrom + cm.lineDeltaX / 4;      cp1y =  cm.parentNodeEndYFrom;
                    cp2x =  cm.parentNodeEndXFrom + cm.lineDeltaX / 4;      cp2y =  cm.parentNodeEndYFrom + cm.lineDeltaY;
                    x2 =    cm.nodeStartX;                                  y2 =    cm.nodeStartY;
                } else {
                    x1 =    cm.parentNodeStartXFrom;                        y1 =    cm.parentNodeStartYFrom;
                    cp1x =  cm.parentNodeStartXFrom - cm.lineDeltaX / 4;    cp1y =  cm.parentNodeStartYFrom;
                    cp2x =  cm.parentNodeStartXFrom - cm.lineDeltaX / 4;    cp2y =  cm.parentNodeStartYFrom + cm.lineDeltaY;
                    x2 =    cm.nodeStartX;                                  y2 =    cm.nodeStartY;
                }
            }
            else if (step === 1) {
                if (cm.path[2] === 0) {
                    x1 =    cm.parentNodeEndX;                              y1 =    cm.parentNodeEndY;
                    cp1x =  cm.parentNodeEndX + cm.lineDeltaX / 4;          cp1y =  cm.parentNodeEndY;
                    cp2x =  cm.parentNodeEndX + cm.lineDeltaX / 4;          cp2y =  cm.parentNodeEndY + cm.lineDeltaY;
                    x2 =    cm.nodeStartX;                                  y2 =    cm.nodeStartY;
                } else {
                    x1 =    cm.parentNodeStartX;                            y1 =    cm.parentNodeStartY;
                    cp1x =  cm.parentNodeStartX - cm.lineDeltaX / 4;        cp1y =  cm.parentNodeStartY;
                    cp2x =  cm.parentNodeStartX - cm.lineDeltaX / 4;        cp2y =  cm.parentNodeStartY + cm.lineDeltaY;
                    x2 =    cm.nodeEndX;                                    y2 =    cm.nodeEndY;
                }
            }

            svgElementData.connection = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' +
                    "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + x2 + ',' + y2,
                color: cm.lineColor,
            }
        }

        // table frame
        if (cm.type === "struct" && cm.hasCell) {
            let r = 8;
            let x1 = cm.path[2] ? cm.nodeEndX : cm.nodeStartX;
            let y1 = cm.nodeStartY - selfHadj / 2 + r;
            let h = cm.selfW - 2 * r;
            let v = cm.selfH - 2 * r;

            svgElementData.tableFrame = {
                type: 'path',
                path: getArc(x1, y1, v, h, r, cm.path[2]),
                color: cm.selected? '#000000' : cm.cBorderColor,
            };
        }

        // table grid
        if (cm.type === "struct" && cm.hasCell) {
            let path = '';
            let rowCount = Object.keys(cm.c).length;
            for (let i = 1; i < rowCount; i++) {
                let x1, y1, x2, y2;
                x1 = cm.nodeStartX;  y1 = cm.nodeStartY - selfHadj/2 + cm.sumMaxRowHeight[i];
                x2 = cm.nodeEndX;    y2 = cm.nodeEndY - selfHadj/2 + cm.sumMaxRowHeight[i];
                path += "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2;
            }

            let colCount = Object.keys(cm.c[0]).length;
            for (let j = 1; j < colCount; j++) {
                let x1, y1, x2, y2;
                x1 = cm.path[2] ? cm.nodeEndX - cm.sumMaxColWidth[j] : cm.nodeStartX + cm.sumMaxColWidth[j]; y1 = cm.nodeStartY - selfHadj/2;
                x2 = cm.path[2] ? cm.nodeEndX - cm.sumMaxColWidth[j] : cm.nodeStartX + cm.sumMaxColWidth[j]; y2 = cm.nodeEndY + selfHadj/2;
                path += "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2;
            }

            svgElementData.tableGrid = {
                type: 'path',
                path: path,
                color: '#dddddd',
            };
        }

        // table cell frame
        if (cm.type === 'cell' && cm.selected) {
            let r = 8;
            let x1 = cm.path[2] ? cm.nodeEndX : cm.nodeStartX;
            let y1 = cm.nodeStartY - selfHadj / 2 + r;
            let h = cm.selfW - 2 * r;
            let v = cm.selfH - 2 * r;

            svgElementData.cellFrame = {
                type: 'path',
                path: getArc(x1, y1, v, h, r, cm.path[2]),
                color: '#000000',
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

            let n = 4;
            let d = 24;
            let gap = 4;
            let wrapWidth = n*d + (n-1)*gap;

            let startX = cm.path[2] === 0 ? mapMem.mapWidth - wrapWidth - 32 : 32 + wrapWidth;

            let x1 = cm.nodeEndX;
            let y1 = cm.nodeEndY;
            let x2 = startX;
            let y2 = cm.nodeEndY;

            svgElementData.taskLine = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2,
                color: '#eeeeee',
            };

            for (let i = 0; i < n; i++) {
                let centerX = cm.path[2] === 0 ? startX + d/2 + i * (d + gap) : startX - d/2 - i * (d + gap);
                let centerY = cm.nodeEndY;

                let fill;
                if (cm.taskStatus === i) {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break;
                        case 1: fill = '#2c9dfc'; break;
                        case 2: fill = '#d5802a'; break;
                        case 3: fill = '#25bf25'; break;
                    }
                }
                else {
                    switch (i) {
                        case 0: fill = '#eeeeee'; break;
                        case 1: fill = '#e5f3fe'; break;
                        case 2: fill = '#f6e5d4'; break;
                        case 3: fill = '#e5f9e5'; break;
                    }
                }

                let r = d/4;
                if (cm.taskStatus === i) {
                    r  = d/2;
                }

                svgElementData['taskCircle' + i] = {
                    type: 'circle',
                    cx: centerX,
                    cy: centerY,
                    r,
                    fill: fill,
                };
            }
        }

        // move indicator
        if (cm.moveIndicator) {
            svgElementData['moveEllipse'] = {
                type: 'ellipse',
                cx: cm.path[2] === 0 ? cm.nodeEndX +10 : cm.nodeStartX - 10,
                cy: cm.nodeStartY,
                rx: 8,
                ry: 12,
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

            let mapSvg = document.getElementById('mapSvg');
            mapSvg.appendChild(svgGroup);
        }
        else {
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
                        case 'path':
                            svgElement.setAttribute("d",                svgElementData[svgElementName].path);
                            svgElement.setAttribute("stroke",           svgElementData[svgElementName].color);
                            svgElement.setAttribute("fill",             "none");
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            svgElement.style.transition =               '0.5s ease-out';
                            svgElement.style.transitionProperty =       'd';
                            break;
                        case 'circle':
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("r",                svgElementData[svgElementName].r);
                            svgElement.setAttribute("fill",             svgElementData[svgElementName].fill);
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            svgElement.style.transition =               '0.5s ease-out';
                            break;
                        case 'ellipse':
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("rx",               svgElementData[svgElementName].rx);
                            svgElement.setAttribute("ry",               svgElementData[svgElementName].ry);
                            svgElement.setAttribute("fill",             '#222222');
                            svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                            break;
                    }
                    svgGroup.appendChild(svgElement);
                    break;
                }
                case 'update': {
                    let svgElement = svgGroup.querySelector('#' + svgElementName);

                    switch (svgElementData[svgElementName].type) {
                        case 'path':
                            svgElement.setAttribute("d",                svgElementData[svgElementName].path);
                            svgElement.setAttribute("stroke",           svgElementData[svgElementName].color);
                            break;
                        case 'circle':
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            svgElement.setAttribute("r",                svgElementData[svgElementName].r);
                            svgElement.setAttribute("fill",             svgElementData[svgElementName].fill);
                            break;
                        case 'ellipse':
                            svgElement.setAttribute("cx",               svgElementData[svgElementName].cx);
                            svgElement.setAttribute("cy",               svgElementData[svgElementName].cy);
                            break;
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

function getArc(x1, y1, v, h, r, dir) {
    if (dir === 0) {
        return 'M' + x1 + ',' + y1 + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 1 ' + (+r) + ',' + (-r) + ' ' + 'h' + (+h) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 1 ' + (+r) + ',' + (+r) + ' ' + 'v' + (+v) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 1 ' + (-r) + ',' + (+r) + ' ' + 'h' + (-h) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 1 ' + (-r) + ',' + (-r);
    } else {
        return 'M' + (x1) + ',' + (y1) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 0 ' + (-r) + ',' + (-r) + ' ' + 'h' + (-h) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 0 ' + (-r) + ',' + (+r) + ' ' + 'v' + (+v) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 0 ' + (+r) + ',' + (+r) + ' ' + 'h' + (+h) + ' ' +
        'a' + (+r) + ',' + (+r) + ' 0 0 0 ' + (+r) + ',' + (-r) + ' ';
    }
}
