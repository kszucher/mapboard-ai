import {getHP, mS} from "../queries/MapQueries.ts"
import {M, S} from "../state/MapStateTypes"

export const mapCalcTask = (m: M) => {
  const hp = getHP(m)
  mS(m).toReversed().forEach(si => {
    if (si.so1.length) {
      si.taskStatus = 4
      for (let i = 0; i < si.so1.length; i++) {
        const so1i = hp.get([...si.path, 's', i].join('')) as S
        si.taskStatus = so1i.taskStatus < si.taskStatus ? so1i.taskStatus : si.taskStatus
      }
    }
  })
}
