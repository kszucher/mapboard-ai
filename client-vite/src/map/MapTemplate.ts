import {M, N} from "../types/DefaultProps"

export const mapTemplate = {
  start: (m: M) => {
    mapTemplate.iterate(m, m.r[0])
  },

  iterate: (m: M, cn: N) => {
    cn.d.map(i => mapTemplate.iterate(m, i))
    cn.s.map(i => mapTemplate.iterate(m, i))
    cn.c.map(i => i.map(j => mapTemplate.iterate(m, j)))
  }
}
