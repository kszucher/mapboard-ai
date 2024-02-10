import {mT} from "../queries/MapQueries.ts"
import {M, T} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  const mHashP = new Map<string, T>(m.map(ti => [ti.path.join(''), ti as T]))
  mT(m).toReversed().forEach(ti => {
    if (ti.tso1.length) {
      ti.taskStatus = 4
      for (let i = 0; i < ti.tso1.length; i++) {
        const cn = mHashP.get([...ti.path, 's', i].join(''))!
        ti.taskStatus = cn.taskStatus < ti.taskStatus ? cn.taskStatus : ti.taskStatus
      }
    }
  })
}
