import {getNodeByPath} from "./MapUtils"
import {M} from "../state/MTypes"

export const mapCalcTask = (mp: M) => {
  const r0d0 = getNodeByPath(mp, ['r', 0, 'd', 0])
  const r0d1 = getNodeByPath(mp, ['r', 0, 'd', 1])
  for (let nIndex = mp.length - 1; nIndex > - 1; nIndex--) {
    const n = mp[nIndex]
    if (n.dCount) {
      n.taskStatus = 0
      const taskStatusRight = r0d0.taskStatus
      const taskStatusLeft = r0d1.taskStatus
      if (r0d0.sCount && r0d1.sCount) {
        n.taskStatus = Math.min(...[taskStatusRight, taskStatusLeft])
      } else if (r0d0.sCount) {
        n.taskStatus = taskStatusRight
      } else if (r0d1.sCount) {
        n.taskStatus = taskStatusLeft
      }
    } else if (n.sCount) {
      n.taskStatus = 4
      for (let i = 0; i < n.sCount; i++) {
        const cn = getNodeByPath(mp, [...n.path, 's', i])
        n.taskStatus = cn.taskStatus < n.taskStatus ? cn.taskStatus : n.taskStatus
      }
    }
  }
}
