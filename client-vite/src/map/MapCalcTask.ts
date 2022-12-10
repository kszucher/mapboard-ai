export const mapCalcTask = {
  start: (m: any) => {
    mapCalcTask.iterate(m, m.r[0])
  },

  iterate: (m: any, cn: any) => {
    let dCount = Object.keys(cn.d).length
    if (dCount) {
      cn.taskStatus = -1
      for (let i = 0; i < dCount; i++) {
        mapCalcTask.iterate(m, cn.d[i])
      }
      const taskStatusRight = cn.d[0].taskStatus
      const taskStatusLeft = cn.d[1].taskStatus
      if (cn.d[0].s.length && cn.d[1].s.length) {
        cn.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (cn.d[0].s.length) {
        cn.taskStatus = taskStatusRight
      } else if (cn.d[1].s.length) {
        cn.taskStatus = taskStatusLeft
      }
    }
    let sCount = Object.keys(cn.s).length
    if (sCount) {
      cn.taskStatus = -1
      let minTaskStatus = 3
      for (let i = 0; i < sCount; i++) {
        mapCalcTask.iterate(m, cn.s[i])
        let currTaskStatus = cn.s[i].taskStatus
        if (currTaskStatus < minTaskStatus) {
          minTaskStatus = currTaskStatus
        }
      }
      cn.taskStatus = minTaskStatus
    }
    cn.c.map((i: any[]) => i.map(j => mapCalcTask.iterate(m, j)))
  }
}
