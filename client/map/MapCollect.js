import {mapMem} from "./Map";
import {copy} from "../core/Utils"

export const mapCollect = {
    start: () => {
        let cm = mapMem.getData().r;
        let params = {
            filter: {
                structSelectedPathList: [],
                cellSelectedPathList: [],
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

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapCollect.iterate(cm.d[i], params);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapCollect.iterate(cm.s[i], params);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapCollect.iterate(cm.c[i][j], params);
            }
        }

    }
};
