import {getCountRXD0S, getCountRXD1S, getCountSO1, getNodeByPath, getRi, isR} from "./MapUtils"
import {M} from "../state/MapPropTypes"

export const mapCalcTask = (m: M) => {
  m.reverse()
  m.forEach(n => {
    if (isR(n.path)) {
      const ri = getRi(n.path)
      const taskStatusRight = getNodeByPath(m, ['r', ri, 'd', 0]).taskStatus
      const taskStatusLeft = getNodeByPath(m, ['r', ri, 'd', 1]).taskStatus
      n.taskStatus = 0
      if (getCountRXD0S(m, ri) && getCountRXD1S(m, ri)) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (getCountRXD0S(m, ri)) {
        n.taskStatus = taskStatusRight
      } else if (getCountRXD1S(m, ri)) {
        n.taskStatus = taskStatusLeft
      }
    } else if (getCountSO1(m, n.path)) {
      n.taskStatus = 4
      for (let i = 0; i < getCountSO1(m, n.path); i++) {
        const cn = getNodeByPath(m, [...n.path, 's', i])
        n.taskStatus = cn.taskStatus < n.taskStatus ? cn.taskStatus : n.taskStatus
      }
    }
  })
  m.reverse()
}
