import {getHP, mTS} from "../queries/MapQueries.ts"
import {M} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  const hp = getHP(m)
  mTS(m).toReversed().forEach(ti => {
    if (ti.so1.length) {
      ti.taskStatus = 4
      for (let i = 0; i < ti.so1.length; i++) {
        const cn = hp.get([...ti.path, 's', i].join(''))!
        ti.taskStatus = cn.taskStatus < ti.taskStatus ? cn.taskStatus : ti.taskStatus
      }
    }
  })
}
