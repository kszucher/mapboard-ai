import {getCountNSO1, getNodeByPath, isR, getCountXRD1S, getCountXRD0S, getNRD0, getNRD1, mT} from "../selectors/MapSelector"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  mT(m).toReversed().forEach(t => {
    if (isR(t.path)) {
      const taskStatusRight = getNRD0(m, t).taskStatus
      const taskStatusLeft = getNRD1(m, t).taskStatus
      t.taskStatus = 0
      if (getCountXRD0S(m) && getCountXRD1S(m)) {
        t.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (getCountXRD0S(m)) {
        t.taskStatus = taskStatusRight
      } else if (getCountXRD1S(m)) {
        t.taskStatus = taskStatusLeft
      }
    } else if (getCountNSO1(m, t)) {
      t.taskStatus = 4
      for (let i = 0; i < getCountNSO1(m, t); i++) {
        const cn = getNodeByPath(m, [...t.path, 's', i])
        t.taskStatus = cn.taskStatus < t.taskStatus ? cn.taskStatus : t.taskStatus
      }
    }
  })
}
