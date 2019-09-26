import {mapMem} from "./Map";

class MapChain {
    start() {
        let cm =                                            mapMem.data.s[0];
        cm.parentPath =                                     [];
        cm.isRoot =                                         1;
        cm.type =                                           'struct';
        cm.index =                                          undefined;

        this.iterate(cm);
    }

    iterate(cm) {

        if (cm.isRoot) {
            cm.path =                                       ["s", 0];
        }
        else {
            switch (cm.type) {
                case 'struct':      cm.path =               cm.parentPath.concat(["s", cm.index]);                    break;
                case 'cell':        cm.path =               cm.parentPath.concat(["c", cm.index[0], cm.index[1]]);    break;
            }
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                cm.c[i][j].parentPath =                     cm.path.slice(0);
                cm.c[i][j].parentType =                     cm.type;
                cm.c[i][j].type =                           'cell';
                cm.c[i][j].index =                          [i, j];

                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            cm.s[i].parentPath =                            cm.path.slice(0);
            cm.s[i].parentType =                            cm.type;
            cm.s[i].type =                                  'struct';
            cm.s[i].index =                                 i;

            this.iterate(cm.s[i]);
        }
    }
}

export let mapChain = new MapChain();
