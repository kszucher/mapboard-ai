import {getCountTSO1, getNodeByPath, isR, getCountXRD1SO1, getCountXRD0SO1, getTRD0, getTRD1, mT} from "../selectors/MapSelector"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  mT(m).toReversed().forEach(ti => {
    if (isR(ti.path)) {
      const taskStatusRight = getTRD0(m, ti).taskStatus
      const taskStatusLeft = getTRD1(m, ti).taskStatus
      ti.taskStatus = 0
      const countXRD0S = getCountXRD0SO1(m)
      const countXRD1S = getCountXRD1SO1(m)
      if (countXRD0S && countXRD1S) {
        ti.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (countXRD0S) {
        ti.taskStatus = taskStatusRight
      } else if (countXRD0S) {
        ti.taskStatus = taskStatusLeft
      }
    } else if (getCountTSO1(m, ti)) {
      ti.taskStatus = 4
      for (let i = 0; i < getCountTSO1(m, ti); i++) {
        const cn = getNodeByPath(m, [...ti.path, 's', i])
        ti.taskStatus = cn.taskStatus < ti.taskStatus ? cn.taskStatus : ti.taskStatus
      }
    }
  })
}
