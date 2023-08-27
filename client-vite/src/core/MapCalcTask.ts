import {getCountNSO1, getNodeByPath, getRi, isR, getCountXRiD1S, getCountXRiD0S} from "./MapUtils"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  m.reverse()
  m.forEach(n => {
    if (isR(n.path)) {
      const taskStatusRight = getNodeByPath(m, ['r', getRi(n.path), 'd', 0]).taskStatus
      const taskStatusLeft = getNodeByPath(m, ['r', getRi(n.path), 'd', 1]).taskStatus
      n.taskStatus = 0
      if (getCountXRiD0S(m) && getCountXRiD1S(m)) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (getCountXRiD0S(m)) {
        n.taskStatus = taskStatusRight
      } else if (getCountXRiD1S(m)) {
        n.taskStatus = taskStatusLeft
      }
    } else if (getCountNSO1(m, n)) {
      n.taskStatus = 4
      for (let i = 0; i < getCountNSO1(m, n); i++) {
        const cn = getNodeByPath(m, [...n.path, 's', i])
        n.taskStatus = cn.taskStatus < n.taskStatus ? cn.taskStatus : n.taskStatus
      }
    }
  })
  m.reverse()
}
