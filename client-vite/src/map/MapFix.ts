import {MPartial, NPartial} from "../types/DefaultProps"
import {getDefaultNode} from "../core/DefaultProps"

export const mapFix = {
  start: (m: MPartial) => {
    mapFix.iterate(m, m.r[0] as NPartial)
  },

  iterate: (m: MPartial, cn: NPartial) => {
    if (cn.type === 'cell' && !cn.s.length) {
      cn.s.push(getDefaultNode({}))
    }
    if (cn.d) cn.d.map((i: any) => mapFix.iterate(m, i))
    if (cn.s) cn.s.map((i: any) => mapFix.iterate(m, i))
    if (cn.c) cn.c.map((i: any[]) => i.map(j => mapFix.iterate(m, j)))
  }
}
