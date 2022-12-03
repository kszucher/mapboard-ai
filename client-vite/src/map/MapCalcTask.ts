// @ts-nocheck

export const mapCalcTask = {
  start: (m, cr) => {
    mapCalcTask.iterate(m, cr)
  },

  iterate: (m, cm) => {
    let dCount = Object.keys(cm.d).length
    if (dCount) {
      cm.taskStatus = -1
      for (let i = 0; i < dCount; i++) {
        mapCalcTask.iterate(m, cm.d[i])
      }
      const taskStatusRight = cm.d[0].taskStatus
      const taskStatusLeft = cm.d[1].taskStatus
      if (cm.d[0].s.length && cm.d[1].s.length) {
        cm.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (cm.d[0].s.length) {
        cm.taskStatus = taskStatusRight
      } else if (cm.d[1].s.length) {
        cm.taskStatus = taskStatusLeft
      }
    }
    let sCount = Object.keys(cm.s).length
    if (sCount) {
      cm.taskStatus = -1
      let minTaskStatus = 3
      for (let i = 0; i < sCount; i++) {
        mapCalcTask.iterate(m, cm.s[i])
        let currTaskStatus = cm.s[i].taskStatus
        if (currTaskStatus < minTaskStatus) {
          minTaskStatus = currTaskStatus
        }
      }
      cm.taskStatus = minTaskStatus
    }
    cm.c.map(i => i.map(j => mapCalcTask.iterate(m, j)))
  }
}
