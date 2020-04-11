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

            let x1 = cm.parentNodeEndX;
            let y1 = cm.parentNodeEndY;
            let cp1x = cm.parentNodeEndX  + cm.lineDeltaX/4;
            let cp1y = cm.parentNodeEndY;
            let cp2x = cm.parentNodeEndX  + cm.lineDeltaX/4;
            let cp2y = cm.parentNodeEndY + cm.lineDeltaY;
            let x2 = cm.nodeStartX;
            let y2 = cm.nodeStartY;

            let svgPathStyle = "M"+x1+','+y1+' '+"C"+cp1x+','+cp1y+' '+cp2x+','+cp2y+' '+x2+','+y2;

            let svgPath;
            if (cm.isSvgAssigned === 0) {
                cm.isSvgAssigned = 1;

                cm.svgPathId = 'svgPath' + genHash(8);
                mapMem.svgPathData[cm.svgPathId] = {svgPathStyle: ""};

                svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                // svgPath.setAttribute("d", "M375,261 C403,261 397,77 425,75");
                svgPath.setAttribute("fill", "transparent");
                svgPath.setAttribute("stroke", "#bbbbbb");
                svgPath.setAttribute("stroke-width", "1");
                svgPath.setAttribute("vector-effect", "non-scaling-stroke");
                svgPath.setAttribute("id", cm.svgPathId);

                let svg = document.getElementById('mapSvg');
                svg.appendChild(svgPath);

                if (svgPathStyle !== mapMem.svgPathData[cm.svgPathId].svgPathStyle) {
                    svgPath.setAttribute("d", svgPathStyle);
                }

                console.log('PATHED')

            }
            else {
                svgPath = document.getElementById(cm.svgPathId);

                if (svgPathStyle !== mapMem.svgPathData[cm.svgPathId].svgPathStyle) {
                    // svgPath.setAttribute("d", svgPathStyle);
                }

                // AND SHALL BE ABLE TO USE DYNAMISM -- get back to this in a jiffy
                // let leftDelta = parseInt(svgPath.style.left, 10) - parseInt(svgPathStyle.left);
                // let topDelta = parseInt(svgPath.style.top, 10) - parseInt(svgPathStyle.top);
                //
                // if (leftDelta !== 0 || topDelta !== 0) {
                //     svgPath.style.transform = "translate(" + leftDelta + ',' + topDelta + ")";
                //     svgPath.style.transition = '0.5s ease-out';
                //
                //     svgPath.style.left = svgPathStyle.left;
                //     svgPath.style.top = svgPathStyle.top;
                // } else {
                //     svgPath.style.transform = '';
                //     svgPath.style.transition = '';
                // }
            }

            // mapMem.svgPathData[cm.svgPathId].svgPathStyle = copy(svgPathStyle);

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
