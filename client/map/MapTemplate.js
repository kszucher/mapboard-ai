export const mapTemplate = {
    start: (m, r) => {
        mapTemplate.iterate(m, r);
    },

    iterate: (m, cm) => {
        cm.d.map(i => mapTemplate.iterate(m, i));
        cm.s.map(i => mapTemplate.iterate(m, i));
        cm.c.map(i => i.map(j => mapTemplate.iterate(m, j)));
    }
};
