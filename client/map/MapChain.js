import {mapMem} from "./Map";

export const mapChain = {
    start: () => {
        let cm = mapMem.getData().s[0];
        Object.assign(cm, {
            parentPath: [],
            isRoot: 1,
            type: 'struct',
            index: undefined,
        });
        mapChain.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.isRoot) {
            cm.path = ["s", 0];
        } else {
            if (cm.type === 'struct') {
                cm.path = cm.parentPath.concat(["s", cm.index]);
            } else if (cm.type === 'cell') {
                cm.path = cm.parentPath.concat(["c", cm.index[0], cm.index[1]]);
            } else {

            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                Object.assign(cm.c[i][j], {
                    parentPath: cm.path.slice(0),
                    parentType: cm.type,
                    parentParentType: cm.parentType,
                    type: 'cell',
                    index: [i, j],
                });
                mapChain.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            Object.assign(cm.s[i], {
                parentPath: cm.path.slice(0),
                parentType: cm.type,
                parentParentType: cm.parentType,
                type: 'struct',
                index: i,
            });
            mapChain.iterate(cm.s[i]);
        }

        if (!(rowCount === 1 && colCount === 0)) {
            cm.childType = 'cell';
        } else if (sCount > 0) {
            cm.childType = 'struct';
        } else {
            cm.childType = '';
        }
    }
};
