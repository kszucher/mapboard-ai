import {keepHash, mapMem, mapSvgData} from "./Map";
import {hasCell} from "../node/Node";
import {genHash, copy} from "../core/Utils";

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
];

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.getData().s[0];
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

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapSvgVisualize.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapSvgVisualize.iterate(cm.s[i]);
        }
    },

    animate: (cm, step) => {

        let svgElementData = {};

        // connection
        if (cm.isRoot !== 1 &&  cm.parentType !== 'cell' &&
            (cm.type === 'struct' && !hasCell(cm) || cm.type === 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {
            let x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2;
            if (step === 0) {
                x1 =    cm.parentNodeEndXFrom;
                y1 =    cm.parentNodeEndYFrom;
                cp1x =  cm.parentNodeEndXFrom + cm.lineDeltaX / 4;
                cp1y =  cm.parentNodeEndYFrom;
                cp2x =  cm.parentNodeEndXFrom + cm.lineDeltaX / 4;
                cp2y =  cm.parentNodeEndYFrom + cm.lineDeltaY;
                x2 =    cm.nodeStartX;
                y2 =    cm.nodeStartY;
            }
            else if (step === 1) {
                x1 =    cm.parentNodeEndX;
                y1 =    cm.parentNodeEndY;
                cp1x =  cm.parentNodeEndX + cm.lineDeltaX / 4;
                cp1y =  cm.parentNodeEndY;
                cp2x =  cm.parentNodeEndX + cm.lineDeltaX / 4;
                cp2y =  cm.parentNodeEndY + cm.lineDeltaY;
                x2 =    cm.nodeStartX;
                y2 =    cm.nodeStartY;
            }

            svgElementData.connection = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' +
                    "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + x2 + ',' + y2,
                color: '#bbbbbb',
            }
        }

        // table
        if (cm.type === "struct" && hasCell(cm)) {
            // grid
            let path = '';
            let rowCount = Object.keys(cm.c).length;
            for (let i = 1; i < rowCount; i++) {
                let x1 = cm.nodeStartX;
                let y1 = cm.nodeStartY - cm.selfH/2 + cm.sumMaxRowHeight[i];
                let x2 = cm.nodeEndX;
                let y2 = cm.nodeEndY - cm.selfH/2 + cm.sumMaxRowHeight[i];
                path += "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2;
            }

            let colCount = Object.keys(cm.c[0]).length;
            for (let j = 1; j < colCount; j++) {
                let x1 = cm.nodeStartX + cm.sumMaxColWidth[j] - 0.5;
                let y1 = cm.nodeStartY   - cm.selfH/2;
                let x2 = cm.nodeStartX + cm.sumMaxColWidth[j] - 0.5;
                let y2 = cm.nodeEndY     + cm.selfH/2;
                path += "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2;
            }

            svgElementData.tableGrid = {
                type: 'path',
                path: path,
                color: '#dddddd',
            };

            // frame
            let round = 8;
            let x1 = cm.centerX - (cm.selfW + 1)/2;
            let y1 = cm.centerY - cm.selfH/2 + round;
            let h = cm.selfW - 2*round;
            let v = cm.selfH - 2*round;

            svgElementData.tableFrame = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' + 'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +  'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' + 'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: cm.selected? '#000000' : '#50dfff',
            };
        }

        // cell frame
        if (cm.type === 'cell' && cm.selected) {
            let round = 8;
            let x1 = cm.centerX - (cm.selfW + 1) / 2;
            let y1 = cm.centerY - cm.selfH / 2 + round;
            let h = cm.selfW - 2 * round;
            let v = cm.selfH - 2 * round;

            svgElementData.cellFrame = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' + 'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +  'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' + 'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: '#000000',
            };
        }

        // task
        if (mapMem.task && Object.keys(cm.s).length === 0 && !hasCell(cm) && cm.parentType !== 'cell' && cm.contentType !== 'image') {
            let startX = 1230;

            let x1 = cm.nodeEndX;
            let y1 = cm.nodeEndY;
            let x2 = startX;
            let y2 = cm.nodeEndY;

            svgElementData.taskLine = {
                type: 'path',
                path: "M" + x1 + ',' + y1 + ' ' + 'L' + x2 + ',' + y2,
                color: '#eeeeee',
            };

            let sphereOffset = 28;
            for (let i = 0; i < 4; i++) {
                let centerX = startX + i * sphereOffset;
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

                svgElementData['taskCircle' + i] = {
                    type: 'circle',
                    cx: centerX,
                    cy: centerY,
                    r: 12,
                    fill: fill,
                }
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
