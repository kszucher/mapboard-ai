import {mapMem} from "./Map";
import {hasCell} from "../node/Node";
import {genHash, copy, isOdd} from "../src/Utils";

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapSvgVisualize.iterate(cm);
    },

    iterate: (cm) => {

        let svgStyle = '';
        let svgColor = '';

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

            svgStyle = "M" + x1 + ',' + y1 + ' ' +
                "C" + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' +
                x2 + ',' + y2;

            svgColor = '#bbbbbb';
        }
        else if (cm.type === "struct" && hasCell(cm)) {
            let selfHadj = isOdd(cm.selfH)? cm.selfH + 1 : cm.selfH;

            let round = 8;

            let x1 = cm.centerX - (cm.selfW + 1)/2;
            let y1 = cm.centerY - selfHadj/2 + round;

            let h = cm.selfW - 2*round;
            let v = cm.selfH - 2*round;

            svgStyle = "M" + x1 + ',' + y1 + ' ' +
                'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' +(-round) + ' ' +
                'h' + h + ' ' +
                'a' + round + ',' + round + ' 0 0 1 ' + (round) + ',' + (round) + ' ' +
                'v' + v + ' ' +
                'a' + round + ',' + round + ' 0 0 1 ' +(-round) + ',' + (round) + ' ' +
                'h' + (-h) + ' ' +
                'a' + round + ',' + round + ' 0 0 1 ' +(-round) + ',' +(-round) + ' '
            ;

            svgColor = '#50dfff';
        }

        if (svgStyle !== '') {
            let svgElement;
            if (cm.isSvgAssigned === 0) {
                cm.isSvgAssigned = 1;

                cm.svgId = 'svg' + genHash(8);
                mapMem.svgData[cm.svgId] = {svgStyle: ""};

                svgElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

                svgElement.setAttribute("fill", "transparent");
                svgElement.setAttribute("stroke", svgColor);
                svgElement.setAttribute("stroke-width", "1");
                svgElement.setAttribute("vector-effect", "non-scaling-stroke");
                svgElement.setAttribute("id", cm.svgId);

                let mapSvg = document.getElementById('mapSvg');
                mapSvg.appendChild(svgElement);

                if (svgStyle !== mapMem.svgData[cm.svgId].svgStyle) {
                    svgElement.setAttribute("d", svgStyle);
                    svgElement.style.transition = '0.5s ease-out';
                }
            }
            else {
                svgElement = document.getElementById(cm.svgId);

                if (svgStyle !== mapMem.svgData[cm.svgId].svgStyle) {
                    svgElement.setAttribute("d", svgStyle);
                }
            }
            mapMem.svgData[cm.svgId].svgStyle = copy(svgStyle);
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
