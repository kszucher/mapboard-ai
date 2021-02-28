import {mapMem} from "./Map";
import {getDefaultNode} from "../node/Node";

export const mapRestore = {
    start: (r) => {
        mapMem.taskLeft = 0;
        mapMem.taskRight = 0;
        mapRestore.iterate(r);
    },

    iterate: (cm) => {
        if (cm.type === 'cell' && !cm.s.length) {
            cm.s.push(getDefaultNode());
        }

        if (cm.task === 1) {
            if (cm.path[2] === 0) {
                mapMem.taskLeft = 1;
            } else {
                mapMem.taskRight = 1;
            }
        }

        if (cm.d) cm.d.map(i => mapRestore.iterate(i));
        if (cm.s) cm.s.map(i => mapRestore.iterate(i));
        if (cm.c) cm.c.map(i => i.map(j => mapRestore.iterate(j)));
    }
};
