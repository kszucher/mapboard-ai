import {resolveConditions} from "../core/DefaultProperties";

export const mapChangeProp = {
    start: (cm, assignment, cond, skip) => {
        mapChangeProp.iterate(cm, assignment, cond, skip);
    },

    iterate: (cm, assignment, cond, skip) => {
        if (skip) {
            skip = false;
        } else {
            if (cond === '' || resolveConditions(cm)[cond]) {
                Object.assign(cm, assignment)
            }
        }
        cm.d.map(i => mapChangeProp.iterate(i, assignment, cond, skip));
        cm.s.map(i => mapChangeProp.iterate(i, assignment, cond, skip));
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, assignment, cond, skip)));
    }
};
