import {mapMem} from "./Map";

export const mapOrient = {
    start: () => {
        let rootChildCount = mapMem.rightCount + mapMem.leftCount;
        for (let i = 0; i < rootChildCount; i++) {
            if (i < mapMem.rightCount) {
                mapOrient.iterate(mapMem.getData().s[0].s[i], 'right')
            } else {
                mapOrient.iterate(mapMem.getData().s[0].s[i], 'left')
            }
        }
    },

    iterate: (cm, orientation) => {

        cm.orientation = orientation;

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapOrient.iterate(cm.c[i][j], orientation);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapOrient.iterate(cm.s[i], orientation);
        }
    }
};
