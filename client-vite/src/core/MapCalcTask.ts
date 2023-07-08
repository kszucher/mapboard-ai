import {getCountD, getCountR0D0S, getCountR0D1S, getCountSS, getNodeByPath} from "./MapUtils"
import {M} from "../state/MapPropTypes"

export const mapCalcTask = (m: M) => {
  const r0d0 = getNodeByPath(m, ['r', 0, 'd', 0])
  const r0d1 = getNodeByPath(m, ['r', 0, 'd', 1])
  m.reverse()
  m.forEach(n => {
    if (getCountD(m, n.path)) {
      n.taskStatus = 0
      // todo: use current r conditionally!!! not a high level r iterator, but a local query, getRXD0 --> getX.rIndex based
      const taskStatusRight = r0d0.taskStatus
      const taskStatusLeft = r0d1.taskStatus
      if (getCountR0D0S(m) && getCountR0D1S(m)) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (getCountR0D0S(m)) {
        n.taskStatus = taskStatusRight
      } else if (getCountR0D1S(m)) {
        n.taskStatus = taskStatusLeft
      }
    } else if (getCountSS(m, n.path)) {
      n.taskStatus = 4
      for (let i = 0; i < getCountSS(m, n.path); i++) {
        const cn = getNodeByPath(m, [...n.path, 's', i])
        n.taskStatus = cn.taskStatus < n.taskStatus ? cn.taskStatus : n.taskStatus
      }
    }
  })
  m.reverse()
}
