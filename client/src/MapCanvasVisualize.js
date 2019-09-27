import {mapMem}                                         from "./Map";
import {eventRouter}                                    from "./EventRouter"
import {hasCell}                                        from "./Node";
import {paintPolygon, paintSelection}                   from "./Ellipse";
import {getBgc} from "./Utils";

class MapCanvasVisualize {
    start () {
        let cm =                                        mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {

        let canvasContext =                             document.getElementById('mapCanvas').getContext('2d');

        if (cm.isRoot === 0 && (cm.type === 'struct' && !hasCell(cm) && cm.parentType !== 'cell' || cm.type === 'cell' && cm.index[0] > 0 && cm.index[1] === 0)) {
            canvasContext.beginPath();
            canvasContext.strokeStyle =                 cm.lineColor;
            canvasContext.lineWidth =                   1;
            canvasContext.moveTo(                       cm.parentNodeEndX + mapMem.padding,                             cm.parentNodeEndY);
            canvasContext.bezierCurveTo(                cm.parentNodeEndX + mapMem.padding + cm.lineDeltaX *1/4,        cm.parentNodeEndY,
                                                        cm.parentNodeEndX + mapMem.padding + cm.lineDeltaX *1/4,        cm.parentNodeEndY + cm.lineDeltaY,
                                                        cm.nodeStartX,                                                  cm.nodeStartY);
            canvasContext.stroke();
        }

        if (cm.type === "struct") {
            if (hasCell(cm)){
                paintSelection(canvasContext, cm.centerX, cm.centerY, cm.selfW, cm.selfH, cm.cBorderColor, 'partial');

                let rowCount = Object.keys(cm.c).length;
                for (let i = 1; i < rowCount; i++) {
                    canvasContext.beginPath();
                    canvasContext.strokeStyle =         '#dddddd';
                    canvasContext.moveTo(               cm.nodeStartX,                                  cm.nodeStartY   - cm.selfH/2    + cm.sumMaxRowHeight[i] );
                    canvasContext.lineTo(               cm.nodeEndX,                                    cm.nodeEndY     - cm.selfH/2    + cm.sumMaxRowHeight[i] );
                    canvasContext.stroke();
                }

                let colCount = Object.keys(cm.c[0]).length;
                for (let j = 1; j < colCount; j++) {
                    canvasContext.beginPath();
                    canvasContext.strokeStyle =         '#dddddd';
                    canvasContext.moveTo(               cm.nodeStartX + cm.sumMaxColWidth[j] + 0.5,     cm.nodeStartY   - cm.selfH/2 );
                    canvasContext.lineTo(               cm.nodeStartX + cm.sumMaxColWidth[j] + 0.5,     cm.nodeEndY     + cm.selfH/2 );
                    canvasContext.stroke();
                }
            }
            else {
                if (cm.polygonFill === 1) {
                    paintPolygon(
                        canvasContext,
                        cm.polygonBorderColor,
                        getBgc(),
                        cm.polygonLineWidth,
                        [
                                                        [cm.centerX - cm.selfW/2,                       cm.centerY      + cm.selfH/2        ],
                                                        [cm.centerX + cm.selfW/2,                       cm.centerY      + cm.familyH/2 + 5  ],
                                                        [1200 - 500 - 30,                               cm.centerY      + cm.familyH/2 + 5  ],
                                                        [1200 - 500 - 30,                               cm.centerY      - cm.familyH/2 - 5  ],
                                                        [cm.centerX + cm.selfW/2,                       cm.centerY      - cm.familyH/2 - 5  ],
                                                        [cm.centerX - cm.selfW/2,                       cm.centerY      - cm.selfH/2        ],
                        ]);

                    cm.ellipseFill =                    1;
                    cm.ellipseFillColor =               cm.polygonBorderColor;
                    cm.lineColor =                      cm.polygonBorderColor;
                }

                if (cm.ellipseFill === 1) {
                    paintPolygon(
                        canvasContext,
                        cm.ellipseBorderColor,
                        cm.ellipseFillColor,
                        cm.ellipseLineWidth,
                        [
                                                        [cm.centerX - cm.selfW/2 - -1,                  cm.centerY + cm.selfH/2 + -1],
                                                        [cm.centerX + cm.selfW/2 + -1,                  cm.centerY + cm.selfH/2 + -1],
                                                        [cm.centerX + cm.selfW/2 + -1,                  cm.centerY - cm.selfH/2 - -1],
                                                        [cm.centerX - cm.selfW/2 - -1,                  cm.centerY - cm.selfH/2 - -1],
                        ])
                }
            }
        }

        if (cm.selected) {
            if (eventRouter.isEditing === 1) {
                paintSelection(canvasContext, cm.centerX, cm.centerY, cm.selfW, cm.selfH, '#000000', 'lefty');
            }
            else {
                if(cm.type !== 'cell') {
                    paintSelection(canvasContext, cm.centerX, cm.centerY, cm.selfW, cm.selfH, '#000000', 'full');
                }
            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapCanvasVisualize = new MapCanvasVisualize();
