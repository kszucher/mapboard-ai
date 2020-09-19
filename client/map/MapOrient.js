import {mapMem} from "./Map";

export const mapOrient = {
    start: () => {
        for (let i in mapMem.rightCount) {mapOrient.iterate(mapMem.getData().s[i], 'r')}
        for (let i in mapMem.leftCount) {mapOrient.iterate(mapMem.getData().s[i], 'l')}
    },

    iterate: (cm, orientation) => {

        cm.orientation = orientation;

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapOrient.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapOrient.iterate(cm.s[i]);
        }
    }
};
