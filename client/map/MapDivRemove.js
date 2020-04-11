import {hasCell} from "../node/Node";
import {clearDiv, clearSvg} from "./Map";

export const mapDivRemove = {
    start: (cm) => {
        mapDivRemove.iterate(cm);
    },

    iterate: (cm) => {
        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDivRemove.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDivRemove.iterate(cm.s[i]);
        }

        if (cm.type === 'struct') {
            if (hasCell(cm)) {
            }
            else {
                clearSvg(cm.svgPathId);
                clearDiv(cm.divId);
            }
        }
    }
};
