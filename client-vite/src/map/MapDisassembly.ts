import {M, N} from "../types/DefaultProps"
import {copy} from "../core/Utils"

let dcm = []

export const mapDisassembly = {
  start: (m: M) => {
    dcm = []
    dcm.push(copy(m.g))
    mapDisassembly.iterate(m.r[0])
    return dcm
  },

  iterate: (n: N) => {
    const nodeCopy = copy(n)
    delete nodeCopy['d']
    delete nodeCopy['s']
    delete nodeCopy['c']
    dcm.push(nodeCopy)
    n.d?.map(i => mapDisassembly.iterate(i))
    n.s?.map(i => mapDisassembly.iterate(i))
    n.c?.map(i => i.map(j => mapDisassembly.iterate(j)))
  }
}
