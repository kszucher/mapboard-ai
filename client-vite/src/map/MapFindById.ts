// @ts-nocheck

let resultPath
let nodeId = ''

export const mapFindById = {
  start: (m, cr, id) => {
    resultPath = []
    nodeId = id
    mapFindById.iterate(m, cr)
    return resultPath
  },

  iterate: (m, cn) => {
    if (cn.nodeId === nodeId) {
      resultPath = cn.path
    }
    cn.d.map(i => mapFindById.iterate(m, i))
    cn.s.map(i => mapFindById.iterate(m, i))
    cn.c.map(i => i.map(j => mapFindById.iterate(m, j)))
  }
}
