export const mapChangeProp = {
    start: (cm, assignment, cond) => {
        mapChangeProp.iterate(cm, assignment, cond);
    },

    iterate: (cm, assignment, cond) => {
        if (cond === 's') {
            if (cm.type === 'struct' && !cm.hasCell) {
                Object.assign(cm, assignment)
            }
        } else {
            Object.assign(cm, assignment)
        }
        cm.d.map(i => mapChangeProp.iterate(i, assignment, cond));
        cm.s.map(i => mapChangeProp.iterate(i, assignment, cond));
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, assignment, cond)));
    }
};
