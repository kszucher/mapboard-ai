import {mapMem} from "./Map";

class MapTemplate {
    start() {
        let cm = mapMem.data.s[0];
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
    }
}

export let mapTemplate = new MapTemplate();
