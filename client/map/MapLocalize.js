import {mapMem, mapref}                                     from "./Map";
import {copy, isMouseInsideRectangle}                       from "../src/Utils"

class MapLocalize {
    start() {
        mapMem.deepestSelectablePath = [];
        mapMem.deepestSelectableRef = [];

        let cm = mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {
        if (isMouseInsideRectangle(cm.centerX, cm.centerY, cm.selfW, cm.selfH)) {
            mapMem.deepestSelectablePath = copy(cm.path);
            mapMem.deepestSelectableRef = mapref(cm.path);
        }

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

export let mapLocalize = new MapLocalize();
