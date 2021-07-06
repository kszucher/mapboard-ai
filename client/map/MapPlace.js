import {mapState} from "../core/MapFlow";

export const mapPlace = {
    start: (m, r) => {
        let {alignment, taskConfigWidth, taskLeft, taskRight, margin, sLineDeltaXDefault} = mapState;

        let leftTaskWidth =     r.d[1].s.length > 0 && taskLeft ? taskConfigWidth: 0;
        let leftMapWidth =      r.d[1].s.length > 0 ? sLineDeltaXDefault + r.d[1].familyW : 0;
        let rightMapWidth =     r.d[0].s.length > 0 ? sLineDeltaXDefault + r.d[0].familyW : 0;
        let rightTaskWidth =    r.d[0].s.length > 0 && taskRight ? taskConfigWidth : 0;

        let leftWidth = leftMapWidth + leftTaskWidth + margin;
        let rightWidth = rightMapWidth + rightTaskWidth + margin;

        let flow = 'both';
        if (r.d[0].s.length && !r.d[1].s.length) flow = 'right';
        if (!r.d[0].s.length && r.d[1].s.length) flow = 'left';

        let sumWidth = 0;
        if (alignment === 'adaptive') {
            if (flow === 'right') {
                sumWidth = margin + r.selfW + rightWidth;
            } else if (flow === 'left') {
                sumWidth = leftWidth + r.selfW + margin;
            } else if (flow === 'both') {
                sumWidth = leftWidth + r.selfW + rightWidth;
            }
        } else if (alignment === 'centered') {
            sumWidth = 2*Math.max(...[leftWidth, rightWidth]) + r.selfW ;
        }

        let divMinWidth = window.screen.availWidth > 1366 ? 1366 : 800;
        let mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth;

        let mapStartCenterX = 0;
        if (alignment === 'centered') {
            mapStartCenterX = mapWidth / 2;
        } else if (alignment === 'adaptive') {
            if (flow === 'both') {
                let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0;
                mapStartCenterX = leftSpace + leftWidth + r.selfW / 2;
            } else if (flow === 'right') {
                mapStartCenterX = margin + r.selfW / 2;
            } else if (flow === 'left') {
                mapStartCenterX = mapWidth - margin - r.selfW / 2;
            }
        }

        let rightMapHeight = r.d.length > 0 ? r.d[0].familyH : 0;
        let leftMapHeight =  r.d.length > 1? r.d[1].familyH : 0;
        let minHeight = Math.max(...[rightMapHeight, leftMapHeight]);
        let mapHeight = minHeight + 60;

        mapState.mapWidth = mapWidth;
        mapState.mapHeight = mapHeight;

        r.parentNodeStartX = mapStartCenterX - r.selfW / 2 + 1;
        r.parentNodeEndX = mapStartCenterX + r.selfW / 2 + 1;
        r.parentNodeY = 0;
        r.lineDeltaX = 0;
        r.lineDeltaY = minHeight / 2 + 30 - 0.5;
        mapPlace.iterate(m, r);
    },

    iterate: (m, cm) => {
        if (cm.isRoot || cm.type === 'dir') {
            cm.nodeStartX = cm.parentNodeStartX;
            cm.nodeEndX = cm.parentNodeEndX;
        } else {
            if (cm.type === 'cell' && cm.parentParentType === 'cell' || cm.parentType === 'cell') {
                if (cm.path[2] === 0) {
                    cm.nodeStartX = cm.parentNodeStartX + 2;
                    cm.nodeEndX = cm.nodeStartX + cm.selfW;
                } else {
                    cm.nodeEndX = cm.parentNodeEndX;
                    cm.nodeStartX = cm.nodeEndX - cm.selfW;
                }
            }

            if (cm.parentType === 'struct' || cm.parentType === 'dir') {
                if (cm.type === 'struct') {
                    if (cm.path[2] === 0) {
                        cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX;
                        cm.nodeEndX = cm.nodeStartX + cm.selfW;
                    } else {
                        cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX;
                        cm.nodeStartX = cm.nodeEndX - cm.selfW;
                    }
                } else if (cm.type === 'cell') {
                    if (cm.parentParentType === 'struct' || cm.parentParentType === 'dir') {
                        let diff = mapState.sLineDeltaXDefault - 20;
                        if (cm.path[2] === 0) {
                            cm.nodeStartX = cm.parentNodeEndX + cm.lineDeltaX + diff;
                            cm.nodeEndX = cm.nodeStartX + cm.selfW;
                        } else {
                            cm.nodeEndX = cm.parentNodeStartX - cm.lineDeltaX - diff;
                            cm.nodeStartX = cm.nodeEndX - cm.selfW;
                        }
                    }
                }
            }
        }
        cm.nodeY = cm.parentNodeY + cm.lineDeltaY;
        if (Number.isInteger(cm.nodeY)) {
            cm.nodeY += 0.5;
        }
        if (Number.isInteger(cm.nodeStartX)) {
            if (cm.path[2] === 0) {
                cm.nodeStartX += 0.5;
                cm.nodeEndX += 0.5;
            } else {
                cm.nodeStartX -= 0.5;
                cm.nodeEndX -= 0.5;
            }
        }
        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            cm.d[i].parentNodeStartX = cm.nodeStartX;
            cm.d[i].parentNodeEndX = cm.nodeEndX;
            cm.d[i].parentNodeY = cm.nodeY;
            cm.d[i].lineDeltaX = 0;
            cm.d[i].lineDeltaY = 0;
            cm.d[i].selfW = cm.selfW;
            cm.d[i].selfH = cm.selfH;
            cm.d[i].isTop = 1;
            cm.d[i].isBottom = 1;
            mapPlace.iterate(m, cm.d[i]);
        }
        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                cm.c[i][j].parentNodeStartX = cm.parentNodeStartX;
                cm.c[i][j].parentNodeEndX = cm.parentNodeEndX;
                cm.c[i][j].parentNodeY = cm.parentNodeY;
                cm.c[i][j].lineDeltaX = cm.sumMaxColWidth[j] + 20;
                cm.c[i][j].lineDeltaY = cm.nodeY + cm.sumMaxRowHeight[i] + cm.maxRowHeight[i]/2 - cm.selfH/2 - cm.parentNodeY;
                mapPlace.iterate(m, cm.c[i][j]);
            }
        }
        let elapsedY = 0;
        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            cm.s[i].parentNodeStartX = cm.nodeStartX;
            cm.s[i].parentNodeEndX = cm.nodeEndX;
            cm.s[i].parentNodeY = cm.nodeY;
            cm.s[i].lineDeltaX = mapState.sLineDeltaXDefault;
            cm.s[i].lineDeltaY = elapsedY + cm.s[i].maxH / 2 - cm.familyH / 2;
            if (i === 0 && cm.isTop) cm.s[i].isTop = 1;
            if (i === sCount - 1 && cm.isBottom === 1) cm.s[i].isBottom = 1;
            mapPlace.iterate(m, cm.s[i]);
            elapsedY += cm.s[i].maxH + cm.spacingActivated*cm.spacing;
        }
    }
};
