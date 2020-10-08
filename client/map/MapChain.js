import {mapMem} from "./Map";

export const mapChain = {
    start: () => {
        let cm = mapMem.getData().r;
        Object.assign(cm, {
            parentPath: [],
            path: ['r'],
            isRoot: 1,
            type: 'struct',
        });
        mapChain.iterate(cm);
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

        let dirCount = Object.keys(cm.d).length;
        for (let i = 0; i < dirCount; i++) {
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

        if (dirCount > 0) {
            cm.childType = 'dir';
        } else if (sCount > 0) {
            cm.childType = 'struct';
        } else if (!(rowCount === 1 && colCount === 0)) {
            cm.childType = 'cell';
        } else {
            cm.childType = '';
        }
    }
};
