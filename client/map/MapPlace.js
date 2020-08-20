import {mapMem} from "./Map";
import {hasCell} from "../node/Node";

export const mapPlace = {
    start: () => {
        let cm = mapMem.getData().s[0];

        let mapWidth = mapMem.task? 1366 : cm.selfW + cm.familyW + mapMem.sLineDeltaXDefault + 1;
        let mapHeight = cm.familyH > cm.selfH? cm.familyH + 2*20: cm.selfH + 2*20;

        mapHeight += 500;

        let div = document.getElementById('mapDiv');
        div.style.width = "" + mapWidth +"px";
        div.style.height = "" + mapHeight + "px";

        let svg = document.getElementById('mapSvg');
        svg.setAttribute("viewBox", "0 0 " + mapWidth + " " + mapHeight);
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

        cm.parentNodeStartX = 0;
        cm.parentNodeStartY = 0;
        cm.parentNodeEndX = 0;
        cm.parentNodeEndY = 0;
        cm.lineDeltaX = mapMem.sLineDeltaXDefault;
        cm.lineDeltaY = cm.familyH > cm.selfH? cm.familyH/2 + 20 - 0.5 : cm.selfH/2 + 20 - 0.5;

        mapPlace.iterate(cm);
    },

    iterate: (cm) => {

        cm.nodeStartX = cm.parentType === 'cell' ? cm.parentNodeStartX : cm.parentNodeEndX + cm.lineDeltaX;
        cm.nodeStartY = cm.parentNodeEndY + cm.lineDeltaY;
        cm.nodeEndX = cm.nodeStartX + cm.selfW;
        cm.nodeEndY = cm.nodeStartY;

        if (Number.isInteger(cm.nodeStartY)) {
            cm.nodeStartY -= 0.5;
            cm.nodeEndY -= 0.5;
        }

        if (cm.type === 'struct') {
            if (hasCell(cm)) {
                let rowCount = Object.keys(cm.c).length;
                let colCount = Object.keys(cm.c[0]).length;
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        cm.c[i][j].parentNodeStartX = cm.parentNodeStartX;
                        cm.c[i][j].parentNodeStartY = cm.parentNodeStartY;
                        cm.c[i][j].parentNodeEndX = cm.parentNodeEndX;
                        cm.c[i][j].parentNodeEndY = cm.parentNodeEndY;

                        cm.c[i][j].lineDeltaX = cm.nodeStartX + cm.sumMaxColWidth[j] - cm.parentNodeEndX;
                        cm.c[i][j].lineDeltaY = cm.nodeStartY + cm.sumMaxRowHeight[i] + cm.maxRowHeight[i]/2 - cm.selfH/2 - cm.parentNodeEndY;

                        mapPlace.iterate(cm.c[i][j]);
                    }
                }
            }
        }

        let elapsedY = 0;
        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            cm.s[i].parentNodeStartX = cm.nodeStartX;
            cm.s[i].parentNodeStartY = cm.nodeStartY;
            cm.s[i].parentNodeEndX = cm.nodeEndX;
            cm.s[i].parentNodeEndY = cm.nodeEndY;
            cm.s[i].lineDeltaX = mapMem.sLineDeltaXDefault;
            cm.s[i].lineDeltaY = cm.familyH*(-1/2) + elapsedY + cm.s[i].maxH/2;

            mapPlace.iterate(cm.s[i]);

            elapsedY += cm.s[i].maxH + cm.spacingActivated*cm.spacing;
        }

        cm.centerX = cm.nodeStartX + cm.selfW/2;
        cm.centerY = cm.nodeStartY;
    }
};
