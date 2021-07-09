import {nodeProps} from "../node/Node";

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
            if (nodeProps.saveAlways.hasOwnProperty(prop)) {

            } else if (nodeProps.saveOptional.hasOwnProperty(prop)) {
                if (cm[prop] === nodeProps.saveOptional[prop]) {
                    delete cm[prop]
                }
            } else {
                delete cm[prop];
            }
        }
    }
};
