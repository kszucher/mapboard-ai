import {mapMem} from "./Map";
import {hasCell} from "../node/Node";
import {paintSelection} from "../paint/PaintSelection";
import {getBgc, isOdd} from "../src/Utils";
import {paintConnection} from "../paint/PaintConnection";

export const mapCanvasVisualize = {
    start: () => {
        let cm = mapMem.data.s[0];
        mapCanvasVisualize.iterate(cm);
    },

    iterate: (cm) => {
        let canvasContext = document.getElementById('mapCanvas').getContext('2d');

        if (cm.isRoot !== 1 &&  cm.parentType !== 'cell' && (cm.type === 'struct' && !hasCell(cm)  ||
            cm.type === 'cell' && cm.index[0] > - 1 && cm.index[1] === 0)) {

            // paintConnection(
            //     canvasContext,
            //     '#ff0000',
            //     cm.parentNodeEndX,
            //     cm.parentNodeEndY,
            //     cm.parentNodeEndX  + cm.lineDeltaX/4,
            //     cm.parentNodeEndY,
            //     cm.parentNodeEndX  + cm.lineDeltaX/4,
            //     cm.parentNodeEndY + cm.lineDeltaY,
            //     cm.nodeStartX,
            //     cm.nodeStartY
            // );
        }

        if (cm.type === "struct") {
            if (hasCell(cm)){

                let selfHadj = isOdd(cm.selfH)? cm.selfH + 1 : cm.selfH;

                // paintSelection(canvasContext, cm.centerX, cm.centerY, cm.selfW, selfHadj, cm.cBorderColor, 'partial');

                let rowCount = Object.keys(cm.c).length;
                for (let i = 1; i < rowCount; i++) {
                    canvasContext.beginPath();
                    canvasContext.strokeStyle = '#dddddd';
                    canvasContext.moveTo(cm.nodeStartX, cm.nodeStartY - selfHadj/2 + cm.sumMaxRowHeight[i] );
                    canvasContext.lineTo(cm.nodeEndX, cm.nodeEndY - selfHadj/2 + cm.sumMaxRowHeight[i] );
                    canvasContext.stroke();
                }

                let colCount = Object.keys(cm.c[0]).length;
                for (let j = 1; j < colCount; j++) {
                    canvasContext.beginPath();
                    canvasContext.strokeStyle =         '#dddddd';
                    canvasContext.moveTo(               cm.nodeStartX + cm.sumMaxColWidth[j] - 0.5,     cm.nodeStartY   - selfHadj/2 );
                    canvasContext.lineTo(               cm.nodeStartX + cm.sumMaxColWidth[j] - 0.5,     cm.nodeEndY     + selfHadj/2 );
                    canvasContext.stroke();
                }
            }
        }
        else if (cm.type === 'cell') {

            if (cm.selected) {

                let selfHadj = isOdd(cm.selfH)? cm.selfH + 1 : cm.selfH;

                paintSelection(canvasContext, cm.centerX, cm.centerY, cm.selfW, selfHadj, cm.cBorderColor, 'partial');


            }

        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapCanvasVisualize.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapCanvasVisualize.iterate(cm.s[i]);
        }
    }
};
