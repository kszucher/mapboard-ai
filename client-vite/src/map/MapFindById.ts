let resultPath
let nodeId = ''

export const mapFindById = {
  start: (m, cr, id) => {
    resultPath = []
    nodeId = id
    mapFindById.iterate(m, cr)
    return resultPath
  },

  iterate: (m, cm) => {
    if (cm.nodeId === nodeId) {
      resultPath = cm.path
    }
    cm.d.map(i => mapFindById.iterate(m, i))
    cm.s.map(i => mapFindById.iterate(m, i))
    cm.c.map(i => i.map(j => mapFindById.iterate(m, j)))
  }
}
