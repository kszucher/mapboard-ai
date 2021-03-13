import {copy} from "../core/Utils"
import {mapState} from "../core/MapState";

export const mapCollect = {
    start: (r) => {
        let params = {
            filter: {
                structSelectedPathList: [],
                cellSelectedPathList: [],
            },
        };
        mapCollect.iterate(r, params);
        mapState.filter = copy(params.filter);
    },

    iterate: (cm, params) => {
        if (cm.selected) {
            if (Number.isInteger(cm.path[cm.path.length - 2])) {
                params.filter.cellSelectedPathList.push(cm.path.slice(0)); // naturally ascending
            } else {
                params.filter.structSelectedPathList.push(cm.path.slice(0));

            }
        }

        cm.d.map(i => mapCollect.iterate(i, params));
        cm.s.map(i => mapCollect.iterate(i, params));
        cm.c.map(i => i.map(j => mapCollect.iterate(j, params)));
    }
};
