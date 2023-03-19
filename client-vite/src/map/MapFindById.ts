import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

let resultPath: any[]
let nodeId = ''

export const mapFindById = {
  start: (m: M, id: string) => {
    resultPath = []
    nodeId = id
    mapFindById.iterate(m, m.r[0])
    return resultPath
  },

  iterate: (m: M, n: N) => {
    if (n.nodeId === nodeId) {
      resultPath = n.path
    }
    n.d.map(i => mapFindById.iterate(m, i))
    n.s.map(i => mapFindById.iterate(m, i))
    n.c.map(i => i.map(j => mapFindById.iterate(m, j)))
  }
}
