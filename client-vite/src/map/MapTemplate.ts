export const mapTemplate = {
  start: (m: any) => {
    mapTemplate.iterate(m, m.r[0])
  },

  iterate: (m: any, cn: any) => {
    cn.d.map((i: any) => mapTemplate.iterate(m, i))
    cn.s.map((i: any) => mapTemplate.iterate(m, i))
    cn.c.map((i: any[]) => i.map(j => mapTemplate.iterate(m, j)))
  }
}
