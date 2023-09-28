import {M, T} from "../state/MapStateTypes"
import {getTSI1, getX, isR, mT} from "../selectors/MapSelector"

export const unselectNodes = (m: M) => mT(m).forEach(ti => Object.assign(ti, {selected: 0, selection: 's'}))

export const selectNode = (m: M, ti: T, selection: 's' | 'f') => {
  unselectNodes(m)
  Object.assign(ti, {selected: 1, selection})
  if (!isR(ti.path)) {
    getTSI1(m, ti).lastSelectedChild = ti.path.at(-1) as number
  }
}

export const selectNodeToo = (m: M, ti: T, selection: 's' | 'f') => {
  Object.assign(ti, {selected: getX(m).selected + 1, selection})
}

export const selectNodeList = (m: M, nList: T[], selection: 's' | 'f') => {
  if (nList.length) {
    unselectNodes(m)
    nList.map((ti, i) => Object.assign(ti, {selected: i + 1, selection}))
  }
}
