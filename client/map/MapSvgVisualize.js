import {mapMem} from "./Map";
import {genHash, copy} from "../src/Utils";
import {hasCell} from "../node/Node";

export const mapSvgVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapSvgVisualize.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.type === 'struct' && ! hasCell(cm)) {
            let svgStyle = {
                x1:     cm.parentNodeEndX,
                y1:     cm.parentNodeEndY,
                cp1x:   cm.parentNodeEndX  + cm.lineDeltaX/4,
                cp1y:   cm.parentNodeEndY,
                cp2x:   cm.parentNodeEndX  + cm.lineDeltaX/4,
                cp2y:   cm.parentNodeEndY + cm.lineDeltaY,
                x2:     cm.nodeStartX,
                y2:     cm.nodeStartY,
            };



            let svg;
            if (cm.isSvgAssigned === 0) {
                cm.isSvgAssigned = 1;

                cm.svgId = 'svg' + genHash(8);
                mapMem.svgData[cm.svgId] = {svgStyle: {}};

                svg = document.createElement('svg');
                svg.id = cm.svgId;
                document.getElementById('mapSvg').appendChild(svg);

                for (let i = 0; i < Object.keys(svgStyle).length; i++) {
                    let styleName = Object.keys(svgStyle)[i];
                    if (svgStyle[styleName] !== mapMem.svgData[cm.svgId].svgStyle[styleName]) {
                        svg.style[styleName] = svgStyle[styleName];
                    }
                }
            }
            else {
                svg = document.getElementById(cm.svgId);

                for (let i = 0; i < Object.keys(svgStyle).length; i++) {
                    let styleName = Object.keys(svgStyle)[i];
                    if (styleName !== 'left' && styleName !== 'top') {
                        if (svgStyle[styleName] !== mapMem.svgData[cm.svgId].svgStyle[styleName]) {
                            svg.style[styleName] = svgStyle[styleName];
                        }
                    }
                }

                let leftDelta = parseInt(svg.style.left, 10) - parseInt(svgStyle.left);
                let topDelta = parseInt(svg.style.top, 10) - parseInt(svgStyle.top);

                if (leftDelta !== 0 || topDelta !== 0) {
                    svg.style.transform = "translate(" + leftDelta + ',' + topDelta + ")";
                    svg.style.transition = '0.5s ease-out';

                    svg.style.left = svgStyle.left;
                    svg.style.top = svgStyle.top;
                } else {
                    svg.style.transform = '';
                    svg.style.transition = '';
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
