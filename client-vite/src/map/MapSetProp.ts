// @ts-nocheck

import {resolveScope} from "../core/DefaultProps"

export const mapSetProp = {
  start: (m, cn, assignment, scope) => {
    if (cn.path.length === 4) {
      Object.assign(m.r[0], typeof assignment === 'function' ? assignment() : assignment)
    }
    mapSetProp.iterate(cn, assignment, scope)
  },

  iterate: (cn, assignment, scope) => {
    if (scope === '' || resolveScope(cn)[scope]) {
      Object.assign(cn, typeof assignment === 'function' ? assignment() : assignment)
    }
    cn.d.map(i => mapSetProp.iterate(i, assignment, scope))
    cn.s.map(i => mapSetProp.iterate(i, assignment, scope))
    cn.c.map(i => i.map(j => mapSetProp.iterate(j, assignment, scope)))
  }
}
