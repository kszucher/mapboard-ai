import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapTemplate = {
  start: (m: M) => {
    mapTemplate.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    n.d.map(i => mapTemplate.iterate(m, i))
    n.s.map(i => mapTemplate.iterate(m, i))
    n.c.map(i => i.map(j => mapTemplate.iterate(m, j)))
  }
}
