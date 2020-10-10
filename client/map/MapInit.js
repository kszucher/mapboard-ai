import {mapMem} from "./Map";
import {props} from "../node/Node"
import {copy, shallowCopy} from "../core/Utils"

export const mapInit = {
    start: () => {
        let cm = mapMem.getData().r;
        mapInit.iterate(cm);
    },

    iterate: (cm) => {
        for (const prop in props.saveAlways) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = copy(props.saveAlways[prop]);
            }
        }

        for (const prop in props.saveOptional) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = shallowCopy(props.saveOptional[prop])
            }
        }

        for (const prop in props.saveNever.initOnce) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = shallowCopy(props.saveNever.initOnce[prop])
            }
        }

        for (const prop in props.saveNever.initAlways) {
            cm[prop] = shallowCopy(props.saveNever.initAlways[prop])
        }

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapInit.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapInit.iterate(cm.s[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapInit.iterate(cm.c[i][j]);
            }
        }
    }
};
