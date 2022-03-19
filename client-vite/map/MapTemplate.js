export const mapTemplate = {
    start: (m, cr) => {
        mapTemplate.iterate(m, cr)
    },

    iterate: (m, cm) => {
        cm.d.map(i => mapTemplate.iterate(m, i))
        cm.s.map(i => mapTemplate.iterate(m, i))
        cm.c.map(i => i.map(j => mapTemplate.iterate(m, j)))
    }
}
