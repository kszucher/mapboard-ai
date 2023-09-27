import {getCountTSO1, getNodeByPath, isR, getCountXRD1S, getCountXRD0S, getTRD0, getTRD1, mT} from "../selectors/MapSelector"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  mT(m).toReversed().forEach(t => {
    if (isR(t.path)) {
      const taskStatusRight = getTRD0(m, t).taskStatus
      const taskStatusLeft = getTRD1(m, t).taskStatus
      t.taskStatus = 0
      const countXRD0S = getCountXRD0S(m)
      const countXRD1S = getCountXRD1S(m)
      if (countXRD0S && countXRD1S) {
        t.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (countXRD0S) {
        t.taskStatus = taskStatusRight
      } else if (countXRD0S) {
        t.taskStatus = taskStatusLeft
      }
    } else if (getCountTSO1(m, t)) {
      t.taskStatus = 4
      for (let i = 0; i < getCountTSO1(m, t); i++) {
        const cn = getNodeByPath(m, [...t.path, 's', i])
        t.taskStatus = cn.taskStatus < t.taskStatus ? cn.taskStatus : t.taskStatus
      }
    }
  })
}
