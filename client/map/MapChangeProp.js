export const mapChangeProp = {
    start: (cm, prop, val, cond) => {
        mapChangeProp.iterate(cm, prop, val, cond);
    },

    iterate: (cm, prop, val, cond) => {
        if (cond === 's') {
            if (cm.type === 'struct' && !cm.hasCell) {
                cm[prop] = val;
            }
        } else {
            cm[prop] = val;
        }
        cm.d.map(i => mapChangeProp.iterate(i, prop, val, cond));
        cm.s.map(i => mapChangeProp.iterate(i, prop, val, cond));
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, prop, val, cond)));
    }
};
