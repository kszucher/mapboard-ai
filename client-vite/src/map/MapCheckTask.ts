// @ts-nocheck

export const mapCheckTask = {
  start: (m, cr) => {
    m.taskLeft = 0
    m.taskRight = 0
    mapCheckTask.iterate(m, cr)
  },

  iterate: (m, cn) => {
    if (cn.taskStatus !== -1 && !cn.path.includes('c') && cn.path.length > 4) {
      try {
        if (cn.path[3] === 0) {
          m.taskRight = 1
        } else {
          m.taskLeft = 1
        }
      } catch {
        console.log(cn.path)
      }
    }
    cn.d.map(i => mapCheckTask.iterate(m, i))
    cn.s.map(i => mapCheckTask.iterate(m, i))
    cn.c.map(i => i.map(j => mapCheckTask.iterate(m, j)))
  }
}
