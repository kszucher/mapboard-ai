import {hasCell} from "../node/Node";
import {clearDiv} from "./Map";

class MapDivRemove {
    start(cm) {
        this.iterate(cm);
    }

    iterate(cm) {
        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }

        if (cm.type === 'struct') {
            if (hasCell(cm)) {
            }
            else {
                clearDiv(cm.divId);
            }
        }
    }
}

export let mapDivRemove = new MapDivRemove();
