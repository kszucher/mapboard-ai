import {mapMem} from "../core/MapState";

export const mapChain = {
    start: (r) => {
        Object.assign(r, {
            parentPath: [],
            path: ['r'],
            isRoot: 1,
            type: 'struct',
        });
        mapChain.iterate(r);
    },

    iterate: (cm) => {
        if (!cm.isRoot) {
            if (cm.type === 'dir') {
                cm.path = cm.parentPath.concat(["d", cm.index]);
            } else if (cm.type === 'struct') {
                cm.path = cm.parentPath.concat(["s", cm.index]);
            } else if (cm.type === 'cell') {
                cm.path = cm.parentPath.concat(["c", cm.index[0], cm.index[1]]);
            }
        }

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            Object.assign(cm.d[i], {
                parentPath: ['r'],
                parentType: cm.type,
                isRootChild: 1,
                type: 'dir',
                index: i,
            });
            mapChain.iterate(cm.d[i]);
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

        cm.hasDir = dCount > 0 ? 1 : 0;
        cm.hasStruct = sCount > 0? 1 : 0;
        cm.hasCell = (rowCount === 1 && colCount === 0) ? 0 : 1;
    }
};
