import {M, N} from "../types/DefaultProps"

let resultPath: any[]
let nodeId = ''

export const mapFindById = {
  start: (m: M, id: string) => {
    resultPath = []
    nodeId = id
    mapFindById.iterate(m, m.r[0])
    return resultPath
  },

  iterate: (m: M, cn: N) => {
    if (cn.nodeId === nodeId) {
      resultPath = cn.path
    }
    cn.d.map(i => mapFindById.iterate(m, i))
    cn.s.map(i => mapFindById.iterate(m, i))
    cn.c.map(i => i.map(j => mapFindById.iterate(m, j)))
  }
}
