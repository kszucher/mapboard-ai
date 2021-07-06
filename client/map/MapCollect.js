import {selectionState} from "../core/SelectionFlow";

export const mapCollect = {
    start: (m, r) => {
        selectionState.structSelectedPathList = [];
        selectionState.cellSelectedPathList = [];

        mapCollect.iterate(m, r);
    },

    iterate: (m, cm) => {
        if (cm.selected) {
            if (Number.isInteger(cm.path[cm.path.length - 2])) {
                selectionState.cellSelectedPathList.push(cm.path.slice(0)); // naturally ascending
            } else {
                selectionState.structSelectedPathList.push(cm.path.slice(0));

            }
        }

        cm.d.map(i => mapCollect.iterate(m, i));
        cm.s.map(i => mapCollect.iterate(m, i));
        cm.c.map(i => i.map(j => mapCollect.iterate(m, j)));
    }
};
