import {props} from "../node/Node";

export const mapDeinit = {
    start: (cm) => {
        mapDeinit.iterate(cm.r);
    },

    iterate: (cm) => {
        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapDeinit.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDeinit.iterate(cm.s[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDeinit.iterate(cm.c[i][j]);
            }
        }

        for (const prop in cm) {
            if (props.saveAlways.hasOwnProperty(prop)) {

            } else if (props.saveOptional.hasOwnProperty(prop)) {
                if (cm[prop] === props.saveOptional[prop]) {
                    delete cm[prop]
                }
            } else {
                delete cm[prop];
            }
        }
    }
};
