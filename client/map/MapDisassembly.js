import {copy} from "../core/Utils";

export let nodeCopyList = [];

export const mapDisassembly = {
    start: (cm) => {
        nodeCopyList = [];
        mapDisassembly.iterate(cm.r);
    },

    iterate: (cm) => {
        let nodeCopy = copy(cm);
        delete nodeCopy['d'];
        delete nodeCopy['s'];
        delete nodeCopy['c'];
        nodeCopyList.push(nodeCopy);

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapDisassembly.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDisassembly.iterate(cm.s[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDisassembly.iterate(cm.c[i][j]);
            }
        }
    }
};
