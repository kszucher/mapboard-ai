import {copy} from "../core/Utils";

let currX, currY = 0;
let lastOverPath = [];

export const mapFindOver = {
    start: (r, x, y) => {
        currX = x;
        currY = y;
        lastOverPath = [];
        mapFindOver.iterate(r);
        return lastOverPath;
    },

    iterate: (cm) => {
        if (cm.nodeStartX < currX &&
            currX < cm.nodeEndX &&
            cm.nodeStartY - cm.selfH / 2 < currY &&
            currY < cm.nodeStartY + cm.selfH  / 2 ) {
            if (cm.index.length !== 2) {
                lastOverPath = copy(cm.path);
            }
        }

        cm.d.map(i => mapFindOver.iterate(i));
        cm.s.map(i => mapFindOver.iterate(i));
        cm.c.map(i => i.map(j => mapFindOver.iterate(j)));
    }
};
