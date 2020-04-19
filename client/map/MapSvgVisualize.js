import {mapMem} from "./Map";
import {hasCell} from "../node/Node";
import {genHash, copy, isObjectEmpty} from "../src/Utils";

let svgGroupElementList = ['connection', 'tableGrid', 'tableFrame', 'cellFrame'];

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapSvgVisualize.iterate(cm);
    },

    iterate: (cm) => {

        let svgGroupData = {};

        if (cm.isRoot !== 1 &&  cm.parentType !== 'cell' && (cm.type === 'struct' && !hasCell(cm)  ||
            cm.type === 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {
            // connection
            let x1 = cm.parentNodeEndX;
            let y1 = cm.parentNodeEndY;
            let cp1x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp1y = cm.parentNodeEndY;
            let cp2x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp2y = cm.parentNodeEndY + cm.lineDeltaY;
            let x2 = cm.nodeStartX;
            let y2 = cm.nodeStartY;

            svgGroupData.connection = {
                path: "M" + x1 + ',' + y1 + ' ' +
                    "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' +
                    x2 + ',' + y2,
                color: '#bbbbbb',
            }
        }

        if (cm.type === "struct" && hasCell(cm)) {
            // table grid
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

            svgGroupData.tableGrid = {
                path: path,
                color: '#dddddd',
            };

            // table frame
            let round = 8;
            let x1 = cm.centerX - (cm.selfW + 1)/2;
            let y1 = cm.centerY - cm.selfH/2 + round;
            let h = cm.selfW - 2*round;
            let v = cm.selfH - 2*round;

            svgGroupData.tableFrame = {
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' +
                    'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                    'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' +
                    'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: cm.selected? '#000000' : '#50dfff',
            };
        }

        // cell highlight
        if (cm.type === 'cell' && cm.selected) {
            let round = 8;
            let x1 = cm.centerX - (cm.selfW + 1) / 2;
            let y1 = cm.centerY - cm.selfH / 2 + round;
            let h = cm.selfW - 2 * round;
            let v = cm.selfH - 2 * round;

            svgGroupData.cellFrame = {
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' +
                    'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                    'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' +
                    'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: '#000000',
            };

        }

        let svgGroup;
        if (cm.isSvgAssigned === 0) {
            cm.isSvgAssigned = 1;

            cm.svgId = 'svg' + genHash(8);

            mapMem.svgData[cm.svgId] = {svgGroupData: {}};

            svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svgGroup.setAttribute("id", cm.svgId);

            let mapSvg = document.getElementById('mapSvg');
            mapSvg.appendChild(svgGroup);
        }
        else {
            svgGroup = document.getElementById(cm.svgId);
        }

        for (const svgGroupElement of svgGroupElementList) {
            let hadBefore = mapMem.svgData[cm.svgId].svgGroupData.hasOwnProperty(svgGroupElement);
            let hasNow = svgGroupData.hasOwnProperty(svgGroupElement);

            let op = '';
            if (hadBefore === false && hasNow === true) op = 'init';
            if (hadBefore === true && hasNow === false) op = 'delete';
            if (hadBefore === true && hasNow === true) {
                if (JSON.stringify(svgGroupData[svgGroupElement]) !==
                    JSON.stringify(mapMem.svgData[cm.svgId].svgGroupData[svgGroupElement])) {
                    op = 'update';
                }
            }

            switch (op) {
                case 'init': {
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

                    svgElement.setAttribute("fill",             "transparent");
                    svgElement.setAttribute("stroke-width",     "1");
                    svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                    svgElement.setAttribute("d",                svgGroupData[svgGroupElement].path);
                    svgElement.setAttribute("stroke",           svgGroupData[svgGroupElement].color);
                    svgElement.setAttribute("id",               svgGroupElement);

                    svgElement.style.transition = '0.5s ease-out';

                    svgGroup.appendChild(svgElement);
                    break;
                }
                case 'update': {
                    let svgElement = svgGroup.querySelector('#' + svgGroupElement);

                    svgElement.setAttribute("d",                svgGroupData[svgGroupElement].path);
                    svgElement.setAttribute("stroke",           svgGroupData[svgGroupElement].color);
                    break;
                }
                case 'delete': {
                    let svgElement = svgGroup.querySelector('#' + svgGroupElement);

                    svgElement.parentNode.removeChild(svgElement);
                    break;
                }
            }
        }

        mapMem.svgData[cm.svgId].svgGroupData = copy(svgGroupData);

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
    }
};
