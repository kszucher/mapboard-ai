import {selectionReducer} from "../core/SelectionReducer";

export const mapCollect = {
    start: (r) => {
        selectionReducer.structSelectedPathList = [];
        selectionReducer.cellSelectedPathList = [];

        mapCollect.iterate(r);
    },

    iterate: (cm) => {
        if (cm.selected) {
            if (Number.isInteger(cm.path[cm.path.length - 2])) {
                selectionReducer.cellSelectedPathList.push(cm.path.slice(0)); // naturally ascending
            } else {
                selectionReducer.structSelectedPathList.push(cm.path.slice(0));

            }
        }

        cm.d.map(i => mapCollect.iterate(i));
        cm.s.map(i => mapCollect.iterate(i));
        cm.c.map(i => i.map(j => mapCollect.iterate(j)));
    }
};
