import {mapMem}                                             from "./Map";
import {hasCell}                                            from "./Node";
import {createArray, getTextDim, getEquationDim}            from "./Utils";

class MapMeasure {
    start() {
        let cm = mapMem.data.s[0];
        let params = {
            hasMultipleChild:                               0,
            hasMultipleContentRow:                          0,
        };
        this.iterate(cm, params);
    }

    iterate(cm, params) {

        params.hasMultipleChild =                           0;
        params.hasMultipleContentRow =                      0;

        if (cm.type === 'struct') {
            if (hasCell(cm)) {
                let rowCount = Object.keys(cm.c).length;
                let colCount = Object.keys(cm.c[0]).length;

                let maxCellHeightMat =                      createArray(rowCount, colCount);
                let maxCellWidthMat =                       createArray(rowCount, colCount);

                let isCellSpacingActivated =                0;

                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        this.iterate(cm.c[i][j], params);

                        maxCellHeightMat[i][j] =            cm.c[i][j].maxH;
                        maxCellWidthMat[i][j] =             cm.c[i][j].maxW;

                        if (cm.c[i][j].maxH > mapMem.defaultH) {
                            isCellSpacingActivated =        1;
                        }
                    }
                }

                if (isCellSpacingActivated === 1) {
                    for (let i = 0; i < rowCount; i++) {
                        for (let j = 0; j < colCount; j++) {
                            maxCellHeightMat[i][j] +=       cm.spacing;
                        }
                    }
                }

                for (let i = 0; i < rowCount; i++) {
                    let maxRowHeight = 0;
                    for (let j = 0; j < colCount; j++) {
                        let cellHeight = maxCellHeightMat[i][j];
                        if (cellHeight >= maxRowHeight)
                            maxRowHeight =                  cellHeight;
                    }
                    cm.maxRowHeight.push(maxRowHeight);
                    cm.sumMaxRowHeight.push(maxRowHeight + cm.sumMaxRowHeight.slice(-1)[0]);
                    cm.selfH +=                             maxRowHeight;
                }

                for (let j = 0; j < colCount; j++) {
                    let maxColWidth = 0;
                    for (let i = 0; i < rowCount; i++) {
                        let cellWidth = maxCellWidthMat[i][j];
                        if (cellWidth >= maxColWidth)
                            maxColWidth =                   cellWidth;
                    }
                    cm.maxColWidth.push(maxColWidth);
                    cm.sumMaxColWidth.push(maxColWidth + cm.sumMaxColWidth.slice(-1)[0]);
                    cm.selfW +=                             maxColWidth;
                }

                if (rowCount > 1) {
                    params.hasMultipleContentRow =          1;
                }
            }
            else {
                if (cm.contentType === 'text' ||
                    cm.contentType === 'elink' ||
                    cm.contentType === 'ilink') {

                    if (cm.dimCalculated === 0) {
                        cm.dimCalculated = 1;
                        cm.contentW =                       getTextDim(cm.content, cm.sTextFontSize);
                        cm.contentH =                       mapMem.defaultH;
                    }

                    cm.selfW =                              cm.contentW + mapMem.padding + 4;
                    cm.selfH =                              cm.contentH;
                }
                else if (cm.contentType === 'equation') {
                    let dim =                               getEquationDim(cm.content, cm.sTextFontSize);

                    cm.contentW =                           dim.w;
                    cm.contentH =                           dim.h;

                    cm.selfW =                              cm.contentW + mapMem.padding + 4;
                    cm.selfH =                              cm.contentH;
                }
                else if (cm.contentType === 'image') {
                    cm.selfW =                              cm.contentW + mapMem.padding;
                    cm.selfH =                              cm.contentH + mapMem.padding;
                }
                else {console.log('should not happen')}
            }
        }


        let sCount = Object.keys(cm.s).length;
        if (sCount) {
            let sMaxW =                                     0;

            for (let i = 0; i < sCount; i++) {
                this.iterate(cm.s[i], params);

                cm.familyH +=                               cm.s[i].maxH;

                let currMaxW =                              cm.s[i].maxW;
                if (currMaxW >= sMaxW) {
                    sMaxW =                                 currMaxW;
                }

                if (params.hasMultipleChild || params.hasMultipleContentRow) {
                    cm.spacingActivated =                   1;
                }
            }

            if (cm.spacingActivated) {
                cm.familyH +=                               (sCount - 1)*cm.spacing;
            }

            cm.familyW =                                    sMaxW + mapMem.sLineDeltaXDefault;
        }
        if(sCount > 1) {
            params.hasMultipleChild =                       1;
        }

        cm.maxW =                                           cm.selfW + cm.familyW;
        cm.maxH =                                           Math.max(...[cm.selfH, cm.familyH]);
    }
}

export let mapMeasure = new MapMeasure();
