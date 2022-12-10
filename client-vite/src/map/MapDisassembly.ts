import {copy} from "../core/Utils"

let dcm = []

export const mapDisassembly = {
  start: (cn: any) => {
    dcm = [{}]
    for (const prop in cn) {
      if (prop !== 'r') {
        // @ts-ignore
        dcm[0][prop] = cn[prop]
      }
    }
    mapDisassembly.iterate(cn.r[0])
    return dcm
  },

  iterate: (cn: any) => {
    let nodeCopy = copy(cn)
    delete nodeCopy['d']
    delete nodeCopy['s']
    delete nodeCopy['c']
    dcm.push(nodeCopy)
    cn.d.map((i: any) => mapDisassembly.iterate(i))
    cn.s.map((i: any) => mapDisassembly.iterate(i))
    cn.c.map((i: any[]) => i.map(j => mapDisassembly.iterate(j)))
  }
}
