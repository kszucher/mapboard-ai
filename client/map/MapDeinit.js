import {props} from "../node/Node";

export const mapDeinit = {
    start: (cm) => {
        delete cm['m']

        mapDeinit.iterate(cm.r);
    },

    iterate: (cm) => {
        cm.d.map(i => mapDeinit.iterate(i));
        cm.s.map(i => mapDeinit.iterate(i));
        cm.c.map(i => i.map(j => mapDeinit.iterate(j)));

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
