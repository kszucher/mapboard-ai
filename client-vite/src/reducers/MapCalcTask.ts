import {getCountNSO1, getNodeByPath, isR, getCountXRD1S, getCountXRD0S, getNRD0, getNRD1} from "../selectors/MapSelectorUtils"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  m.reverse()
  m.forEach(n => {
    if (isR(n.path)) {
      const taskStatusRight = getNRD0(m, n).taskStatus
      const taskStatusLeft = getNRD1(m, n).taskStatus
      n.taskStatus = 0
      if (getCountXRD0S(m) && getCountXRD1S(m)) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (getCountXRD0S(m)) {
        n.taskStatus = taskStatusRight
      } else if (getCountXRD1S(m)) {
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
