// @ts-nocheck

import {getDefaultNode} from "../core/DefaultProps"

export const mapFix = {
  start: (m, cr) => {
    mapFix.iterate(m, cr)
  },

  iterate: (m, cn) => {
    if (cn.type === 'cell' && !cn.s.length) {
      cn.s.push(getDefaultNode({}))
    }
    if (cn.d) cn.d.map(i => mapFix.iterate(m, i))
    if (cn.s) cn.s.map(i => mapFix.iterate(m, i))
    if (cn.c) cn.c.map(i => i.map(j => mapFix.iterate(m, j)))
  }
}
