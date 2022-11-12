// @ts-nocheck

export const mapTaskCheck = {
  start: (m, cr) => {
    m.taskLeft = 0
    m.taskRight = 0
    mapTaskCheck.iterate(m, cr)
  },

  iterate: (m, cm) => {
    if (cm.taskStatus !== -1 && !cm.path.includes('c') && cm.path.length > 4) {
      try {
        if (cm.path[3] === 0) {
          m.taskRight = 1
        } else {
          m.taskLeft = 1
        }
      } catch {
        console.log(cm.path)
      }
    }
    cm.d.map(i => mapTaskCheck.iterate(m, i))
    cm.s.map(i => mapTaskCheck.iterate(m, i))
    cm.c.map(i => i.map(j => mapTaskCheck.iterate(m, j)))
  }
}
