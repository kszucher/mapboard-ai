export const mapTemplate = {
    start: (r) => {
        mapTemplate.iterate(r);
    },

    iterate: (cm) => {
        cm.d.map(i => mapTemplate.iterate(i));
        cm.s.map(i => mapTemplate.iterate(i));
        cm.c.map(i => i.map(j => mapTemplate.iterate(j)));
    }
};
