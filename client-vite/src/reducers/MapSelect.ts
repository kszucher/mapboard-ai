import {M, N, R, S, C, T} from "../state/MapStateTypes"
import {getX, mT} from "../queries/MapQueries.ts"

export const unselectNodes = (m: M) => mT(m).forEach(ti => Object.assign(ti, {selected: 0, selection: 's'}))

export const selectR = (m: M, ri: R) => {
  unselectNodes(m)
  ri.selected = 1
}

export const selectS = (m: M, si: S, selection: 's' | 'f') => {
  unselectNodes(m)
  si.selected = 1
  si.selection = selection
}

export const selectC = (m: M, ci: C) => {
  unselectNodes(m)
  ci.selected = 1
}

export const selectT = (m: M, ti: T, selection: 's' | 'f') => {
  unselectNodes(m)
  Object.assign(ti, {selected: 1, selection})
}

export const selectAddT = (m: M, ti: T, selection: 's' | 'f') => {
  Object.assign(ti, {selected: getX(m).selected + 1, selection})
}

export const selectRemoveT = (ti: T) => {
  Object.assign(ti, {selected: 0, selection: 's'})
}

export const selectTL = (m: M, nList: N[], selection: 's' | 'f') => {
  if (nList.length) {
    unselectNodes(m)
    nList.map((ti, i) => Object.assign(ti, {selected: i + 1, selection}))
  }
}
