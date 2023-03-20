import {MPartial} from "../state/MTypes"
import {NPartial} from "../state/NPropsTypes"
import {getDefaultNode} from "../core/MapUtils";

export const mapFix = {
  start: (m: MPartial) => {
    mapFix.iterate(m, m.r[0] as NPartial)
  },

  iterate: (m: MPartial, n: NPartial) => {
    if (n.type === 'cell' && !n.sCount) {
      n.s.push(getDefaultNode({}))
    }
    if (n.d) n.d.map(i => mapFix.iterate(m, i))
    if (n.s) n.s.map(i => mapFix.iterate(m, i))
    if (n.c) n.c.map(i => i.map(j => mapFix.iterate(m, j)))
  }
}
