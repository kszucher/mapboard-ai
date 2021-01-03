export const mapChangeProp = {
    start: (cm, prop, val) => {
        mapChangeProp.iterate(cm, prop, val);
    },

    iterate: (cm, prop, val) => {
        cm[prop] = val;
        cm.d.map(i => mapChangeProp.iterate(i, prop, val));
        cm.s.map(i => mapChangeProp.iterate(i, prop, val));
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, prop, val)));
    }
};
