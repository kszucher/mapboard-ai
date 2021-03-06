import {copy} from "../core/Utils";

let currX, currY = 0;
let aboveRoot, belowRoot = 0;
let lastNearestPath = [];

export const mapFindNearest = {
    start: (r, x, y) => {
        currX = x;
        currY = y;
        aboveRoot = r.nodeStartY < y;
        belowRoot = r.nodeStartY > y;
        lastNearestPath = [];
        mapFindNearest.iterate(r);
        return lastNearestPath;
    },

    iterate: (cm) => {
        if (!cm.selected) {
            cm.d.map(i => mapFindNearest.iterate(i));
            if (cm.type === 'cell') {
                cm.s.map(i => mapFindNearest.iterate(i));
            } else {
                let overlap = 6;
                let vCondition;
                if (cm.isTop && belowRoot) {
                    vCondition = currY < (cm.nodeStartY + cm.maxH / 2 + overlap)
                } else if (cm.isBottom && aboveRoot) {
                    vCondition = currY > (cm.nodeStartY - cm.maxH / 2 - overlap)
                } else {
                    vCondition = Math.abs(currY - cm.nodeStartY) <= cm.maxH / 2 + overlap;
                }
                let hCondition =
                    (cm.path[2] === 0 && currX > cm.nodeEndX) ||
                    (cm.path[2] === 1 && currX < cm.nodeStartX);
                if (vCondition && hCondition) {
                    lastNearestPath = copy(cm.path);
                    cm.s.map(i => mapFindNearest.iterate(i));
                }
            }
            cm.c.map(i => i.map(j => mapFindNearest.iterate(j)));
        }
    }
};
