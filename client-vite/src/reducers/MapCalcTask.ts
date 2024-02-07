import {getNodeByPath, mT} from "../queries/MapQueries.ts"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  mT(m).toReversed().forEach(ti => {
    if (ti.countTSO1) {
      ti.taskStatus = 4
      for (let i = 0; i < ti.countTSO1; i++) {
        const cn = getNodeByPath(m, [...ti.path, 's', i])
        ti.taskStatus = cn.taskStatus < ti.taskStatus ? cn.taskStatus : ti.taskStatus
      }
    }
  })
}
