import {createArray, getEquationDim, getTextDim} from "../core/Utils";
import {mapState} from "../core/MapState";

export const mapMeasure = {
    start: (r) => {
        mapMeasure.iterate(r, {
            hasMultipleChild: 0,
            hasMultipleContentRow: 0,
        });
    },

    iterate: (cm, params) => {
        params.hasMultipleChild = 0;
        params.hasMultipleContentRow = 0;

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapMeasure.iterate(cm.d[i], params);
        }

        let sCount = Object.keys(cm.s).length;
        if (sCount) {
            let sMaxW = 0;
            for (let i = 0; i < sCount; i++) {
                mapMeasure.iterate(cm.s[i], params);
                cm.familyH += cm.s[i].maxH;
                let currMaxW = cm.s[i].maxW;
                if (currMaxW >= sMaxW) {
                    sMaxW = currMaxW;
                }
                if (params.hasMultipleChild || params.hasMultipleContentRow) {
                    cm.spacingActivated = 1;
                }
            }
            if (cm.spacingActivated) {
                cm.familyH += (sCount - 1)*cm.spacing;
            }
            cm.familyW = sMaxW + mapState.sLineDeltaXDefault;
        }
        if (sCount > 1) {
            params.hasMultipleChild = 1;
        }

        if (cm.type === 'struct') {
            if (cm.hasCell) {
                let rowCount = Object.keys(cm.c).length;
                let colCount = Object.keys(cm.c[0]).length;
                let maxCellHeightMat = createArray(rowCount, colCount);
                let maxCellWidthMat = createArray(rowCount, colCount);
                let isCellSpacingActivated = 0;

                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        mapMeasure.iterate(cm.c[i][j], params);
                        maxCellHeightMat[i][j] = cm.c[i][j].maxH;
                        maxCellWidthMat[i][j] = cm.c[i][j].maxW;
                        if (cm.c[i][j].maxH > mapState.defaultH) {
                            isCellSpacingActivated = 1;
                        }
                    }
                }

                if (isCellSpacingActivated === 1) {
                    for (let i = 0; i < rowCount; i++) {
                        for (let j = 0; j < colCount; j++) {
                            maxCellHeightMat[i][j] += cm.spacing;
                        }
                    }
                }

                for (let i = 0; i < rowCount; i++) {
                    let maxRowHeight = 0;
                    for (let j = 0; j < colCount; j++) {
                        let cellHeight = maxCellHeightMat[i][j];
                        if (cellHeight >= maxRowHeight)
                            maxRowHeight = cellHeight;
                    }
                    cm.maxRowHeight.push(maxRowHeight);
                    cm.sumMaxRowHeight.push(maxRowHeight + cm.sumMaxRowHeight.slice(-1)[0]);
                    cm.selfH += maxRowHeight;
                }

                for (let j = 0; j < colCount; j++) {
                    let maxColWidth = 0;
                    for (let i = 0; i < rowCount; i++) {
                        let cellWidth = maxCellWidthMat[i][j];
                        if (cellWidth >= maxColWidth)
                            maxColWidth = cellWidth;
                    }
                    cm.maxColWidth.push(maxColWidth);
                    cm.sumMaxColWidth.push(maxColWidth + cm.sumMaxColWidth.slice(-1)[0]);
                    cm.selfW += maxColWidth;
                }

                for (let j = 0; j < colCount; j++) {
                    for (let i = 0; i < rowCount; i++) {
                        cm.c[i][j].selfW = cm.maxColWidth[j];
                        cm.c[i][j].selfH = cm.maxRowHeight[i];
                    }
                }

                if (rowCount > 1) {
                    params.hasMultipleContentRow = 1;
                }
            }
            else {
                if (cm.contentType === 'text') {
                    if (cm.isDimAssigned === 0) {
                        cm.isDimAssigned = 1;
                        let dimVec = getTextDim(cm.content, cm.sTextFontSize);
                        let x = dimVec[0];
                        let y = dimVec[1];
                        let lineCount = y/17;
                        let realY = lineCount <= 1 ? mapState.defaultH : y + mapState.padding*2;
                        cm.contentW = mapState.density === 'large' ? x : x + 8;
                        let yc = mapState.density === 'large' ? 1 : 2;
                        cm.contentH = realY - mapState.padding*2 + yc;
                    }
                } else if (cm.contentType === 'equation') {
                    if (cm.isDimAssigned === 0) {
                        cm.isDimAssigned = 1;
                        let dim = getEquationDim(cm.content);
                        cm.contentW = dim.w;
                        cm.contentH = dim.h;
                    }
                } else if (cm.contentType === 'image') {
                    cm.contentW = cm.imageW;
                    cm.contentH = cm.imageH;
                }
                else {console.log('unknown contentType')}

                cm.selfW = cm.contentW + mapState.padding*2;
                cm.selfH = cm.contentH + mapState.padding*2;
            }
        }

        cm.maxW = cm.selfW + cm.familyW;
        cm.maxH = Math.max(...[cm.selfH, cm.familyH]);
    }
};
