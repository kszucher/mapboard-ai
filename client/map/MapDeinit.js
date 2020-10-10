import {props} from "../node/Node";

export const mapDeinit = {
    start: (cml) => {
        mapDeinit.iterate(cml);
    },

    iterate: (cml) => {
        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapDeinit.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cml.s).length;
        for (let i = 0; i < sCount; i++) {
            mapDeinit.iterate(cml.s[i]);
        }

        let rowCount = Object.keys(cml.c).length;
        let colCount = Object.keys(cml.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapDeinit.iterate(cml.c[i][j]);
            }
        }

        for (const prop of cml) {
            if (props.saveAlways.hasOwnProperty(prop)) {

            } else if (props.saveOptional.hasOwnProperty(prop)) {
                if (cml[prop] === props.saveOptional[prop]) {
                    delete cml[prop]
                }
            } else {
                delete cml[prop];
            }
        }
    }
};
