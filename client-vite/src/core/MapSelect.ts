import {M, N, P} from "../state/MapStateTypes"
import {getNodeByPath, getSI1P, getX, isR} from "./MapUtils"

export const unselectNodes = (m: M) => m.forEach(n => n.path.length > 1 && Object.assign(n, {selected: 0, selection: 's'}))

export const selectNode = (m: M, n: N, selection: 's' | 'f') => {
  unselectNodes(m)
  Object.assign(n, {selected: 1, selection})
  if (!isR(n.path)) {
    getNodeByPath(m, getSI1P(n.path)).lastSelectedChild = n.path.at(-1) as number
  }
}

export const selectNodeToo = (m: M, n: N, selection: 's' | 'f') => {
  Object.assign(n, {selected: getX(m).selected + 1, selection})
}

export const selectNodeList = (m: M, nList: N[], selection: 's' | 'f') => {
  if (nList.length) {
    unselectNodes(m)
    nList.map((n, i) => Object.assign(n, {selected: i + 1, selection}))
  }
}
