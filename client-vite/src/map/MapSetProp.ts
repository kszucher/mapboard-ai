import {N} from "../types/DefaultProps"

export const mapSetProp = {
  iterate: (n: N, assignment: Function | object, condition: Function | boolean) => {
    if (typeof condition === 'function' ? condition(n) : condition) {
      Object.assign(n, typeof assignment === 'function' ? assignment() : assignment)
    }
    n.d?.map(i => mapSetProp.iterate(i, assignment, condition))
    n.s?.map(i => mapSetProp.iterate(i, assignment, condition))
    n.c?.map(i => i.map(j => mapSetProp.iterate(j, assignment, condition)))
  }
}
