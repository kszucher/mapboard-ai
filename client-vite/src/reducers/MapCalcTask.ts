import {getCountTSO1, getNodeByPath, mT} from "../selectors/MapQueries.ts"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  mT(m).toReversed().forEach(ti => {
    if (getCountTSO1(m, ti)) {
      ti.taskStatus = 4
      for (let i = 0; i < getCountTSO1(m, ti); i++) {
        const cn = getNodeByPath(m, [...ti.path, 's', i])
        ti.taskStatus = cn.taskStatus < ti.taskStatus ? cn.taskStatus : ti.taskStatus
      }
    }
  })
}
