import {mapMem} from "./Map";
import {copy} from "../core/Utils";

let currX, currY = 0;
let lastFoundPath = [];

export const mapFind = {
    start: (x, y) => {
        currX = x;
        currY = y;
        lastFoundPath = [];
        let cm = mapMem.getData().r;
        mapFind.iterate(cm);
        return lastFoundPath;
    },

    iterate: (cm) => {
        cm.d.map(i => mapFind.iterate(i));
        if (Math.abs(currY - cm.nodeStartY) <= cm.maxH / 2 && (
            (cm.path[2] === 0 && (currX > (cm.nodeStartX - mapMem.sLineDeltaXDefault))) ||
            (cm.path[2] === 1 && (currX < (cm.nodeEndX + mapMem.sLineDeltaXDefault))))) {
            lastFoundPath = copy(cm.path);
            cm.s.map(i => mapFind.iterate(i));
            cm.c.map(i => i.map(j => mapFind.iterate(j)));
        }
    }
};
