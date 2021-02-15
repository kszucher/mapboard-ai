import {mapMem} from "./Map";
import {copy} from "../core/Utils"

export const mapCollect = {
    start: () => {
        let cm = mapMem.getData().r;
        let params = {
            filter: {
                structSelectedPathList: [],
                cellSelectedPathList: [],
                unselectedPlacementList: [],
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

        if (!cm.selected && cm.type === 'struct') {
            // TODO prevent to collect ANY child of ANY selected node --> smart recursion required
            params.filter.unselectedPlacementList.push({
                path: cm.path.slice(0),
                equalX: cm.path[2] === 0 ? cm.nodeStartX : cm.nodeEndX,
                equalY: cm.nodeStartY,
                nonEqualX: cm.path[2] === 0 ? cm.nodeEndX : cm.nodeStartX,
                // TODO topCoords, bottomCords
            });
        }

        cm.d.map(i => mapCollect.iterate(i, params));
        cm.s.map(i => mapCollect.iterate(i, params));
        cm.c.map(i => i.map(j => mapCollect.iterate(j, params)));
    }
};
