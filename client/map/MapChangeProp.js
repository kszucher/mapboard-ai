import {resolveScope} from "../core/DefaultProps";

export const mapChangeProp = {
    start: (cm, assignment, scope, check, skip) => {
        mapChangeProp.iterate(cm, assignment, scope, check, skip);
    },

    iterate: (cm, assignment, scope, check, skip) => {
        if (skip === true) {
            skip = false;
        } else {
            if (scope === '' || resolveScope(cm)[scope]) {
                Object.assign(cm, typeof assignment === 'function' ? assignment() : assignment)
            }
        }
        cm.d.map(i => mapChangeProp.iterate(i, assignment, scope, check, skip));
        cm.s.map(i => mapChangeProp.iterate(i, assignment, scope, check, skip));
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, assignment, scope, check, skip)));
    }
};
