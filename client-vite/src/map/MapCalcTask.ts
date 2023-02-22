import {M, N} from "../types/DefaultProps"

export const mapCalcTask = {
  start: (m: M) => {
    mapCalcTask.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    let dCount = Object.keys(n.d).length
    if (dCount) {
      n.taskStatus = 0
      for (let i = 0; i < dCount; i++) {
        mapCalcTask.iterate(m, n.d[i])
      }
      const taskStatusRight = n.d[0].taskStatus
      const taskStatusLeft = n.d[1].taskStatus
      if (n.d[0].s.length && n.d[1].s.length) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (n.d[0].s.length) {
        n.taskStatus = taskStatusRight
      } else if (n.d[1].s.length) {
        n.taskStatus = taskStatusLeft
      }
    }
    let sCount = Object.keys(n.s).length
    if (sCount) {
      n.taskStatus = 0
      let minTaskStatus = 4
      for (let i = 0; i < sCount; i++) {
        mapCalcTask.iterate(m, n.s[i])
        let currTaskStatus = n.s[i].taskStatus
        if (currTaskStatus < minTaskStatus) {
          minTaskStatus = currTaskStatus
        }
      }
      n.taskStatus = minTaskStatus
    }
    n.c.map((i) => i.map(j => mapCalcTask.iterate(m, j)))
  }
}
