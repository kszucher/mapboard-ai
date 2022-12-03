// @ts-nocheck

import {copy} from "../core/Utils"

let dcm = []

export const mapDisassembly = {
  start: (cn) => {
    dcm = [{}]
    for (const prop in cn) {
      if (prop !== 'r') {
        dcm[0][prop] = cn[prop]
      }
    }
    // TODO loop
    mapDisassembly.iterate(cn.r[0])
    return dcm
  },

  iterate: (cn) => {
    let nodeCopy = copy(cn)
    delete nodeCopy['d']
    delete nodeCopy['s']
    delete nodeCopy['c']
    dcm.push(nodeCopy)
    cn.d.map(i => mapDisassembly.iterate(i))
    cn.s.map(i => mapDisassembly.iterate(i))
    cn.c.map(i => i.map(j => mapDisassembly.iterate(j)))
  }
}
