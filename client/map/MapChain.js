import {mapState} from "../core/MapFlow";

export const mapChain = {
    start: (m, r) => {
        Object.assign(r, {
            parentPath: [],
            path: ['r'],
            isRoot: 1,
            type: 'struct',
        });
        mapChain.iterate(m, r);
    },

    iterate: (m, cm) => {
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
            mapChain.iterate(m, cm.d[i]);
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
            mapChain.iterate(m, cm.s[i]);
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
                mapChain.iterate(m, cm.c[i][j]);
            }
        }

        cm.hasDir = dCount > 0 ? 1 : 0;
        cm.hasStruct = sCount > 0? 1 : 0;
        cm.hasCell = (rowCount === 1 && colCount === 0) ? 0 : 1;
    }
};
