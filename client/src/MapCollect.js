import {mapMem} from "./Map";
import {copy} from "./Utils"
import {hasCell} from "./Node";

class MapCollect {
    start() {
        let cm = mapMem.data.s[0];
        let params = {
            filter: {
                structSelectedPathList: [],
                cellSelectedPathList: [],
                taskEndPathList: [],
            }
        };
        this.iterate(cm, params);
        mapMem.filter = copy(params.filter);
    }

    iterate(cm, params) {
        if (cm.selected) {
            if (Number.isInteger(cm.path[cm.path.length - 2])) {
                params.filter.cellSelectedPathList.push(cm.path.slice(0)); // naturally ascending
            }
            else {
                params.filter.structSelectedPathList.push(cm.path.slice(0));

            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j], params);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i], params);
        }

        if (sCount === 0 && !hasCell(cm) && cm.parentType !== 'cell' && cm.contentType !== 'image') {
            params.filter.taskEndPathList.push(cm.path.slice(0));
        }
    }
}

export let mapCollect = new MapCollect();
