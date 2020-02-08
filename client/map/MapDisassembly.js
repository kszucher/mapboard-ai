import {copy} from "../src/Utils";

export let nodeCopyList = [];

class MapDisassembly {
    start(cml) {
        nodeCopyList = [];

        this.iterate(cml);
    }

    iterate(cml) {
        let nodeCopy = copy(cml);
        delete nodeCopy['s'];
        delete nodeCopy['c'];
        nodeCopyList.push(nodeCopy);

        let rowCount = Object.keys(cml.c).length;
        let colCount = Object.keys(cml.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cml.c[i][j]);
            }
        }

        let sCount = Object.keys(cml.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cml.s[i]);
        }
    }
}

export let mapDisassembly = new MapDisassembly();
