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

        cm.d.map(i => mapInit.iterate(i));
        cm.s.map(i => mapInit.iterate(i));
        cm.c.map(i => i.map(j => mapInit.iterate(j)));
    }
};
