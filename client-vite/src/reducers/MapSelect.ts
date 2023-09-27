import {M, T} from "../state/MapStateTypes"
import {getTSI1, getX, isR, mT} from "../selectors/MapSelector"

export const unselectNodes = (m: M) => mT(m).forEach(t => Object.assign(t, {selected: 0, selection: 's'}))

export const selectNode = (m: M, t: T, selection: 's' | 'f') => {
  unselectNodes(m)
  Object.assign(t, {selected: 1, selection})
  if (!isR(t.path)) {
    getTSI1(m, t).lastSelectedChild = t.path.at(-1) as number
  }
}

export const selectNodeToo = (m: M, t: T, selection: 's' | 'f') => {
  Object.assign(t, {selected: getX(m).selected + 1, selection})
}

export const selectNodeList = (m: M, nList: T[], selection: 's' | 'f') => {
  if (nList.length) {
    unselectNodes(m)
    nList.map((t, i) => Object.assign(t, {selected: i + 1, selection}))
  }
}
