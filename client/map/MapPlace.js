import {mapMem} from "./Map";

export const mapPlace = {
    start: () => {
        let cm = mapMem.getData().r;

        let arrangement = 'left'; // left or center, comes from user preference
        if (cm.d[1].s.length > 0) {
            arrangement = 'center' // this overwrites user preference
        }

        // WIDTH
        let n = 4;
        let d = 24;
        let gap = 4;
        let taskWidth = n*d + (n-1)*gap;

        let leftMarginWidth = 32;
        let leftTaskWidth =     cm.d[1].s.length > 0 && mapMem.task ? taskWidth: 0;
        let leftMapWidth =      cm.d[1].s.length > 0 ? cm.d[1].selfW + mapMem.sLineDeltaXDefault + cm.d[1].familyW  : 0;
        let rightMapWidth =     cm.d[0].s.length > 0 ? cm.d[0].selfW + mapMem.sLineDeltaXDefault + cm.d[0].familyW  : 0;
        let rightTaskWidth =    cm.d[0].s.length > 0 && mapMem.task ? taskWidth : 0;
        let rightMarginWidth = 32;
        
        let leftWidth = leftMarginWidth + leftTaskWidth + leftMapWidth;
        let rightWidth = rightMapWidth + rightTaskWidth + rightMarginWidth;
        let sumWidth = leftWidth + cm.selfW + rightWidth;

        let minWidth = 1366;
        let mapWidth = sumWidth < minWidth ? minWidth : sumWidth;

        let mapStartCenterX = 0;
        if (arrangement === 'left') {
            mapStartCenterX = leftMarginWidth + cm.selfW / 2;
        } else if (arrangement === 'center') {
            let leftSpace = sumWidth < minWidth ? (minWidth - sumWidth) / 2 : 0;
            mapStartCenterX = leftMarginWidth + leftTaskWidth + leftSpace +  leftMapWidth + cm.selfW/2;
        }

        mapMem.mapWidth = mapWidth;

        // HEIGHT
        let rightMapHeight =    cm.d.length > 0? cm.d[0].familyH > cm.d[0].selfH ? cm.d[0].familyH : cm.d[0].selfH : 0;
        let leftMapHeight =     cm.d.length > 1? cm.d[1].familyH > cm.d[1].selfH ? cm.d[1].familyH : cm.d[1].selfH : 0;
        let minHeight = Math.max(...[rightMapHeight, leftMapHeight]);
        let mapHeight = minHeight + 500;

        // APPLY
        let mapDiv = document.getElementById('mapDiv');
        mapDiv.style.width = "" + mapWidth + "px";
        mapDiv.style.height = "" + mapHeight + "px";

        let svg = document.getElementById('mapSvg');
        svg.setAttribute("viewBox", "0 0 "
            + mapWidth + " "
            + mapHeight);
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

        cm.parentNodeStartX = mapStartCenterX;
        cm.parentNodeStartY = 0;
        cm.parentNodeEndX = mapStartCenterX;
        cm.parentNodeEndY = 0;
        cm.lineDeltaX = 0;
        cm.lineDeltaY = minHeight / 2 + 30 - 0.5;
        mapPlace.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.isRoot) {
            cm.nodeStartX = cm.parentNodeStartX - cm.selfW / 2;
            cm.nodeEndX = cm.nodeStartX + cm.selfW;
        }
        else {
            if (cm.parentType === 'struct' || cm.parentType === 'dir') {
                if (cm.type === 'struct' || cm.type === 'dir') {
                    if (cm.path[2] === 0) {
                        cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX;
                        cm.nodeEndX = cm.parentNodeEndX + cm.lineDeltaX + cm.selfW;
                    } else {
                        cm.nodeStartX = cm.parentNodeStartX - cm.lineDeltaX - cm.selfW;
                        cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX;
                    }
                } else if (cm.type === 'cell') {
                    let diff = mapMem.sLineDeltaXDefault - 20;
                    if (cm.path[2] === 0) {
                        cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX + diff;
                        cm.nodeEndX = cm.parentNodeEndX + cm.lineDeltaX + cm.selfW + diff;
                    } else {
                        cm.nodeStartX = cm.parentNodeStartX - cm.lineDeltaX - cm.selfW - diff;
                        cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX - diff;
                    }
                }
            } else if (cm.parentType === 'cell') {
                if (cm.path[2] === 0) {
                    cm.nodeStartX = cm.parentNodeStartX + 1;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                } else {
                    cm.nodeStartX = cm.parentNodeEndX - cm.selfW;
                    cm.nodeEndX = cm.parentNodeEndX;
                }
            }
        }

        cm.nodeStartY = cm.parentNodeEndY + cm.lineDeltaY;
        cm.nodeEndY = cm.nodeStartY;

        if (Number.isInteger(cm.nodeStartY)) {
            cm.nodeStartY += 0.5;
            cm.nodeEndY += 0.5;
        }

        if (Number.isInteger(cm.nodeStartX)) {
            cm.nodeStartX += 0.5;
            cm.nodeEndX += 0.5;
        }

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            cm.d[i].parentNodeStartX = cm.nodeStartX;
            cm.d[i].parentNodeStartY = cm.nodeStartY;
            cm.d[i].parentNodeEndX = cm.nodeEndX;
            cm.d[i].parentNodeEndY = cm.nodeEndY;
            cm.d[i].lineDeltaX = 0;
            cm.d[i].lineDeltaY = 0;
            mapPlace.iterate(cm.d[i]);
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
