// @ts-nocheck

export const mapTemplate = {
  start: (m, cr) => {
    mapTemplate.iterate(m, cr)
  },

  iterate: (m, cn) => {
    cn.d.map(i => mapTemplate.iterate(m, i))
    cn.s.map(i => mapTemplate.iterate(m, i))
    cn.c.map(i => i.map(j => mapTemplate.iterate(m, j)))
  }
}
