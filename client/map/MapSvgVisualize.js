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
        let svgShouldRender = false;

        if (cm.isRoot !== 1 &&  cm.parentType !== 'cell' && (cm.type === 'struct' && !hasCell(cm)  ||
            cm.type === 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {

            let x1 = cm.parentNodeEndX;
            let y1 = cm.parentNodeEndY;
            let cp1x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp1y = cm.parentNodeEndY;
            let cp2x = cm.parentNodeEndX + cm.lineDeltaX / 4;
            let cp2y = cm.parentNodeEndY + cm.lineDeltaY;
            let x2 = cm.nodeStartX;
            let y2 = cm.nodeStartY;

            svgShouldRender = true;
            svgGroupData.push({
                path: "M" + x1 + ',' + y1 + ' ' +
                    "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' +
                    x2 + ',' + y2,
                color: '#bbbbbb',
                id: 'connection'
            })
        }

        if (cm.type === "struct" && hasCell(cm)) {
            let selfHadj = isOdd(cm.selfH)? cm.selfH + 1 : cm.selfH;

            let round = 8;

            let x1 = cm.centerX - (cm.selfW + 1)/2;
            let y1 = cm.centerY - selfHadj/2 + round;

            let h = cm.selfW - 2*round;
            let v = cm.selfH - 2*round;

            svgShouldRender = true;
            svgGroupData.push({
                path: "M" + x1 + ',' + y1 + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (-round) + ' ' +
                    'h' + h + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                    'v' + v + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (round) + ' ' +
                    'h' + (-h) + ' ' +
                    'a' + round + ',' + round + ' 0 0 1 ' + (-round) + ',' + (-round),
                color: '#50dfff',
                id: 'cellFrame'
            })

            // FURTHER STUFF

        }

        if (svgShouldRender) {
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
                        let svgElement = svgGroup.childNodes.item(svgGroupDataElement.id);
                        svgElement.setAttribute("d", svgGroupDataElement.path);
                        svgElement.setAttribute("stroke", svgGroupDataElement.color);
                    }
                }
            }
            
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
