import {mapMem} from "./Map";
import {copy} from "../core/Utils"

export const mapCollect = {
    start: () => {
        let cm = mapMem.getData().r;
        let params = {
            filter: {
                structSelectedPathList: [],
                cellSelectedPathList: [],
                endCoords: [],
            }
        };
        mapCollect.iterate(cm, params);
        mapMem.filter = copy(params.filter);
    },

    iterate: (cm, params) => {
        if (cm.selected) {
            if (Number.isInteger(cm.path[cm.path.length - 2])) {
                params.filter.cellSelectedPathList.push(cm.path.slice(0)); // naturally ascending
            } else {
                params.filter.structSelectedPathList.push(cm.path.slice(0));

            }
        }

        if (cm.type === 'struct') {
            // TODO different case for the left side of the map
            params.filter.endCoords.push({path: cm.path.slice(0), endCoord:[cm.nodeEndX, cm.nodeEndY]});
        }

        cm.d.map(i => mapCollect.iterate(i, params));
        cm.s.map(i => mapCollect.iterate(i, params));
        cm.c.map(i => i.map(j => mapCollect.iterate(j, params)));
    }
};
