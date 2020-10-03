import {mapMem} from "./Map";

export const mapPlace = {
    start: () => {
        let cm = mapMem.getData();

        let minRightWidth = cm.s[0].selfW + cm.s[0].familyW + mapMem.sLineDeltaXDefault;
        let minLeftWidth = cm.s[1].selfW + cm.s[1].familyW + mapMem.sLineDeltaXDefault;
        let minWidth = mapMem.flow === 'right'? minRightWidth : Math.max(...[minRightWidth, minLeftWidth])*2;

        let minRightHeight = cm.s[0].familyH > cm.s[0].selfH ? cm.s[0].familyH : cm.s[0].selfH;
        let minLeftHeight = cm.s[1].familyH > cm.s[1].selfH ? cm.s[1].familyH : cm.s[1].selfH;
        let minHeight = mapMem.flow === 'right'? minRightHeight : Math.max(...[minRightHeight, minLeftHeight]);

        let mapHeight = minHeight + 500;
        let mapWidth = minWidth; // add custom values to achive custom column widths

        if (mapMem.task) mapWidth = 1366;

        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.minWidth = "" + mapWidth + "px";
        mapDiv.style.height = "" + mapHeight + "px";

        let svg = document.getElementById('mapSvg');
        svg.setAttribute("viewBox", "0 0 "
            + mapWidth + " "
            + mapHeight);
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

        for (let i = 0; i < cm.s.length; i++) {
            if (mapMem.flow === 'right') {
                cm.s[i].parentNodeStartX = 0;
                cm.s[i].parentNodeStartY = 0;
                cm.s[i].parentNodeEndX = 0;
                cm.s[i].parentNodeEndY = 0;
                cm.s[i].lineDeltaX = 20;
                cm.s[i].lineDeltaY = minHeight / 2 + 20 - 0.5;
            }
            else if (mapMem.flow === 'center') {
                cm.s[i].parentNodeStartX = mapWidth / 2;
                cm.s[i].parentNodeStartY = 0;
                cm.s[i].parentNodeEndX = mapWidth / 2;
                cm.s[i].parentNodeEndY = 0;
                cm.s[i].lineDeltaX = 0;
                cm.s[i].lineDeltaY = minHeight / 2 + 20 - 0.5;
            }

            mapPlace.iterate(cm.s[i]);
        }
    },

    iterate: (cm) => {
        if (cm.parentType === 'cell') {
            if (cm.path[1] === 0) {
                cm.nodeStartX = cm.parentNodeStartX;
                cm.nodeEndX = cm.nodeStartX + cm.selfW;
            } else {
                cm.nodeStartX = cm.parentNodeEndX - cm.selfW;
                cm.nodeEndX = cm.parentNodeEndX;
            }
        } else {
            if (cm.isRoot) {
                if (mapMem.flow === 'right') {
                    cm.nodeStartX = cm.parentNodeStartX + cm.lineDeltaX;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                } else if (mapMem.flow === 'center') {
                    cm.nodeStartX = cm.parentNodeStartX - cm.selfW / 2;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                }
            } else {
                if (cm.path[1] === 0) { // right
                    cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                } else { // left
                    cm.nodeStartX = cm.parentNodeStartX - cm.lineDeltaX - cm.selfW;
                    cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX;
                }
            }
        }
        cm.nodeStartY = cm.parentNodeEndY + cm.lineDeltaY;
        cm.nodeEndY = cm.nodeStartY;

        if (Number.isInteger(cm.nodeStartY)) {
            cm.nodeStartY -= 0.5;
            cm.nodeEndY -= 0.5;
        }

        if (Number.isInteger(cm.nodeStartX)) {
            cm.nodeStartX -= 0.5;
            cm.nodeEndX -= 0.5;
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                cm.c[i][j].parentNodeStartX = cm.parentNodeStartX;
                cm.c[i][j].parentNodeStartY = cm.parentNodeStartY;
                cm.c[i][j].parentNodeEndX = cm.parentNodeEndX;
                cm.c[i][j].parentNodeEndY = cm.parentNodeEndY;
                cm.c[i][j].lineDeltaX = cm.sumMaxColWidth[j] + 20;
                cm.c[i][j].lineDeltaY = cm.nodeStartY + cm.sumMaxRowHeight[i] + cm.maxRowHeight[i]/2 - cm.selfH/2 - cm.parentNodeEndY;

                mapPlace.iterate(cm.c[i][j]);
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
    }
};
