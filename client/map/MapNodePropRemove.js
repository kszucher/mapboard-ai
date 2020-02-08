import {props} from "../node/Node";

class MapNodePropRemove {
    start(cml) {
        this.iterate(cml);
    }

    iterate(cml) {
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

        let currKeys = Object.keys(cml);
        for (let i = 0; i < currKeys.length; i++) {
            let currProperty = currKeys[i];
            if (props.saveOptional.hasOwnProperty(currProperty)) {
                if (currProperty === 'c') {
                    if (cml.c.length === 1 && cml.c[0].length === 0) {
                        // delete cml['c'];
                    }
                }
                else if (currProperty === 's') {
                    if (cml.s.length === 0) {
                        // delete cml['s'];
                    }
                }
                else if (cml[currProperty] === props.saveOptional[currProperty]) {
                    delete cml[currProperty];
                }
            }
            else {
                delete cml[currProperty];
            }
        }
    }
}

export let mapNodePropRemove = new MapNodePropRemove();
