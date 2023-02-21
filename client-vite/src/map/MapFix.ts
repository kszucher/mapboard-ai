import {getDefaultNode} from "../core/DefaultProps"
import {MPartial} from "../types/DefaultProps"

export const mapFix = {
  start: (m: MPartial) => {
    mapFix.iterate(m, m.r[0])
  },

  iterate: (m: any, cn: any) => {
    if (cn.type === 'cell' && !cn.s.length) {
      cn.s.push(getDefaultNode({}))
    }
    if (cn.d) cn.d.map((i: any) => mapFix.iterate(m, i))
    if (cn.s) cn.s.map((i: any) => mapFix.iterate(m, i))
    if (cn.c) cn.c.map((i: any[]) => i.map(j => mapFix.iterate(m, j)))
  }
}
