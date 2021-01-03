import {mapMem} from "./Map";
import {getDefaultNode} from "../node/Node";

export const mapRestore = {
    start: () => {
        let cm = mapMem.getData().r;
        mapRestore.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.type === 'cell' && !cm.s.length) {
            cm.s.push(getDefaultNode());
        }

        if (cm.d) cm.d.map(i => mapRestore.iterate(i));
        if (cm.s) cm.s.map(i => mapRestore.iterate(i));
        if (cm.c) cm.c.map(i => i.map(j => mapRestore.iterate(j)));
    }
};
