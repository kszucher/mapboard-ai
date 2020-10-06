import {copy} from "../core/Utils";

export let nodeCopyList = [];

export const mapDisassembly = {
    start: (cml) => {
        nodeCopyList = [];

        mapDisassembly.iterate(cml);
    },

    iterate: (cml) => {
        let nodeCopy = copy(cml);
        delete nodeCopy['s'];
        delete nodeCopy['c'];
        nodeCopyList.push(nodeCopy);

        let dirCount = Object.keys(cm.d).length;
        for (let i = 0; i < dirCount; i++) {
            mapDisassembly.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cml.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDisassembly.iterate(cml.s[i]);
        }

        let rowCount = Object.keys(cml.c).length;
        let colCount = Object.keys(cml.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDisassembly.iterate(cml.c[i][j]);
            }
        }
    }
};
