import {mapMem} from "./Map";
import {hasCell} from "../node/Node";
import {genHash, copy, isOdd} from "../src/Utils";

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapSvgVisualize.iterate(cm);
    },

    iterate: (cm) => {

        let svgGroupData = [];
        let svgShouldUpdate = false;

        // connection
        if (cm.isRoot !== 1 &&  cm.parentType !== 'cell' && (cm.type === 'struct' && !hasCell(cm)  ||
            cm.type === 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {

            svgShouldUpdate = true;

            let x1 = cm.parentNodeEndX;
            let y1 = cm.parentNodeEndY;
            let cp1x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp1y = cm.parentNodeEndY;
            let cp2x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp2y = cm.parentNodeEndY + cm.lineDeltaY;
            let x2 = cm.nodeStartX;
            let y2 = cm.nodeStartY;

            svgGroupData.push({
                path: "M" + x1 + ',' + y1 + ' ' +
                    "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' +
                    x2 + ',' + y2,
                color: '#bbbbbb',
                id: 'connection'
            })
        }

        // table grid and table frame
        if (cm.type === "struct" && hasCell(cm)) {
            svgShouldUpdate = true;

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

            svgGroupData.push({
                path: path,
                color: '#dddddd',
                id: 'tableGrid'
            });

            // table frame
            let round = 8;

            let x1 = cm.centerX - (cm.selfW + 1)/2;
            let y1 = cm.centerY - cm.selfH/2 + round;

            let h = cm.selfW - 2*round;
            let v = cm.selfH - 2*round;

            svgGroupData.push({
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' +
                    'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                    'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' +
                    'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: cm.selected? '#000000' : '#50dfff',
                id: 'tableFrame'
            });
        }

        // cell highlight
        if (cm.type === 'cell') {
            svgShouldUpdate = true;

            if (cm.selected) {

                let round = 8;

                let x1 = cm.centerX - (cm.selfW + 1) / 2;
                let y1 = cm.centerY - cm.selfH / 2 + round;

                let h = cm.selfW - 2 * round;
                let v = cm.selfH - 2 * round;

                svgGroupData.push({
                    path: "M" + x1 + ',' + y1 + ' ' +
                        'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' +
                        'h' + h + ' ' +
                        'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                        'v' + v + ' ' +
                        'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' +
                        'h' + (-h) + ' ' +
                        'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                    color: '#000000',
                    id: 'cellHighlight'
                });
            }
            else {
                svgGroupData.push({
                    path: "M0,0 L0,0",
                    color:'#000000',
                    id: 'cellHighlight'
                });
            }
        }

        if (svgShouldUpdate) {
            let svgGroup;
            if (cm.isSvgAssigned === 0) {
                cm.isSvgAssigned = 1;

                cm.svgId = 'svg' + genHash(8);

                mapMem.svgData[cm.svgId] = {svgGroupData: []};

                svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                svgGroup.setAttribute("id", cm.svgId);

                let mapSvg = document.getElementById('mapSvg');
                mapSvg.appendChild(svgGroup);

                for (const svgGroupDataElement of svgGroupData) {
                    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

                    svgElement.setAttribute("fill",             "transparent");
                    svgElement.setAttribute("stroke-width",     "1");
                    svgElement.setAttribute("vector-effect",    "non-scaling-stroke");
                    svgElement.setAttribute("d",                svgGroupDataElement.path);
                    svgElement.setAttribute("stroke",           svgGroupDataElement.color);
                    svgElement.setAttribute("id",               svgGroupDataElement.id);

                    svgElement.style.transition = '0.5s ease-out';

                    svgGroup.appendChild(svgElement);
                }
            }
            else {
                svgGroup = document.getElementById(cm.svgId);
                if (JSON.stringify(svgGroupData) !== JSON.stringify(mapMem.svgData[cm.svgId].svgGroupData)) {
                    for (const svgGroupDataElement of svgGroupData) {
                        let svgElement = svgGroup.querySelector('#' + svgGroupDataElement.id);

                        svgElement.setAttribute("d",            svgGroupDataElement.path);
                        svgElement.setAttribute("stroke",       svgGroupDataElement.color);
                    }
                }
            }

            // isRendered === 0, shouldRender === 0 --> default
            // isRendered === 0, shouldRender === 1 --> init
            // isRendered === 1, shouldRender === 1 --> update
            // isRendered === 1, shouldRender === 0 --> delete

            mapMem.svgData[cm.svgId].svgGroupData = copy(svgGroupData);
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
    }
};
