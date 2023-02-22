import {N} from "../types/DefaultProps"

export const mapSetProp = {
  iterate: (cn: N, assignment: Function | object, condition: Function | boolean) => {
    if (typeof condition === 'function' ? condition(cn) : condition) {
      Object.assign(cn, typeof assignment === 'function' ? assignment() : assignment)
    }
    cn.d.map(i => mapSetProp.iterate(i, assignment, condition))
    cn.s.map(i => mapSetProp.iterate(i, assignment, condition))
    cn.c.map(i => i.map(j => mapSetProp.iterate(j, assignment, condition)))
  }
}
