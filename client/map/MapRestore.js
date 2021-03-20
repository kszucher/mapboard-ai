import {getDefaultNode} from "../node/Node";

let selectionFound = 0;

export const mapRestore = {
    start: (r) => {
        mapRestore.iterate(r);
        if (!selectionFound) {
            r.selected = 1;
            console.log('MAP RESTORED AFTER NO SELECTION')
        }
    },

    iterate: (cm) => {
        if (cm.selected) {
            selectionFound = 1;
        }

        if (cm.type === 'cell' && !cm.s.length) {
            cm.s.push(getDefaultNode());
        }
        if (cm.d) cm.d.map(i => mapRestore.iterate(i));
        if (cm.s) cm.s.map(i => mapRestore.iterate(i));
        if (cm.c) cm.c.map(i => i.map(j => mapRestore.iterate(j)));
    }
};
