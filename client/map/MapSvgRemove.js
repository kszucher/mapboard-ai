import {clearSvg} from "./Map";

export const mapSvgRemove = {
    start: (cm) => {
        mapSvgRemove.iterate(cm);
    },

    iterate: (cm) => {
        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapSvgRemove.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapSvgRemove.iterate(cm.s[i]);
        }

        if (cm.isSvgAssigned) {
            clearSvg(cm.svgId);
        }
    }
};
