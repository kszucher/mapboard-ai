import {mapMem} from "./Map";

export const mapTemplate = {
    start: () => {
        let cm = mapMem.getData().s[0];
        mapTemplate.iterate(cm);
    },

    iterate: (cm) => {
        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapTemplate.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapTemplate.iterate(cm.s[i]);
        }
    }
};
