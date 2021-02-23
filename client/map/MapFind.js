import {mapMem, mapref} from "./Map";
import {copy} from "../core/Utils";

let currX, currY = 0;
let aboveRoot, belowRoot = 0;
let lastFoundPath = [];

export const mapFind = {
    start: (x, y) => {
        currX = x;
        currY = y;
        let cm = mapMem.getData().r;
        aboveRoot = cm.nodeStartY < y;
        belowRoot = cm.nodeStartY > y;
        lastFoundPath = [];
        mapFind.iterate(cm);
        return lastFoundPath;
    },

    iterate: (cm) => {
        if (!cm.selected) {
            cm.d.map(i => mapFind.iterate(i));
            if (cm.type === 'cell') {
                cm.s.map(i => mapFind.iterate(i));
            } else {
                let condition = Math.abs(currY - cm.nodeStartY) <= cm.maxH / 2 + 12; // 12 is slightly smaller than smallest font
                if (cm.isTop && belowRoot) {
                    condition = currY < (cm.nodeStartY + cm.maxH / 2 + 12)
                }
                if (cm.isBottom && aboveRoot) {
                    condition = currY > (cm.nodeStartY - cm.maxH / 2 - 12)
                }

                if (condition && (
                    cm.path[2] === 0 && currX > cm.nodeEndX ||
                    cm.path[2] === 1 && currX < cm.nodeStartX )) {
                    lastFoundPath = copy(cm.path);

                    cm.s.map(i => mapFind.iterate(i));
                }
            }
            cm.c.map(i => i.map(j => mapFind.iterate(j)));
        }
    }
};
