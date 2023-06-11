import {M, P} from "../state/MapPropTypes"
import {getNodeByPath, getParentNodeByPath, getSI1, getX, isR} from "./MapUtils"

export const unselectNodes = (m: M) => m.forEach(n => n.path.length > 1 && Object.assign(n, {selected: 0, selection: 's'}))

export const selectNode = (m: M, path: P, selection: 's' | 'f') => {
  unselectNodes(m)
  Object.assign(getNodeByPath(m, path), {selected: 1, selection})
  if (!isR(path)) {
    // getNodeByPath(m, getSI1(path)).lastSelectedChild = path.at(-1)
  }
}
export const selectNodeToo = (m: M, path: P, selection: 's' | 'f') => {
  Object.assign(getNodeByPath(m, path), {selected: getX(m).selected + 1, selection})
}
export const selectNodeList = (m: M, pList: P[], selection: 's' | 'f') => {
  unselectNodes(m)
  pList.map((p, i) => Object.assign(getNodeByPath(m, p), {selected: i + 1, selection}))
}
