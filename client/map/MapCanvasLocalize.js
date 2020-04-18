import {mapMem, mapref} from "./Map";
import {copy, isMouseInsideRectangle} from "../src/Utils"

export const mapCanvasLocalize = {
    start: () => {
        mapMem.deepestSelectablePath = [];
        mapMem.deepestSelectableRef = [];

        let cm = mapMem.data.s[0];
        mapCanvasLocalize.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.type !== 'cell' && isMouseInsideRectangle(cm.centerX, cm.centerY, cm.selfW, cm.selfH)) {
            mapMem.deepestSelectablePath = copy(cm.path);
            mapMem.deepestSelectableRef = mapref(cm.path);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapCanvasLocalize.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapCanvasLocalize.iterate(cm.s[i]);
        }
    }
};
