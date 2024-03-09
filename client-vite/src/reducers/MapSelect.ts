import {M, R, S, C} from "../state/MapStateTypes"
import {getXR, getXS, mR, mS, mC} from "../queries/MapQueries.ts"

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

export const selectAddR = (m: M, ri: R) => {
  ri.selected = getXR(m).selected + 1
}

export const selectAddS = (m: M, si: S, selection: 's' | 'f') => {
  Object.assign(si, {selected: getXS(m).selected + 1, selection})
}


export const selectRL = (m: M, rList: R[]) => {
  unselectNodes(m)
  rList.forEach((ri, i) => ri.selected = i + 1)
}

export const selectSL = (m: M, sList: S[]) => {
  unselectNodes(m)
  sList.forEach((si, i) => si.selected = i + 1)
}

export const selectCL = (m: M, cList: C[]) => {
  unselectNodes(m)
  cList.forEach((ci, i) => ci.selected = i + 1)
}

export const unselectNodes = (m: M) => {
  mR(m).forEach(ri => Object.assign(ri, {selected: 0, selection: 's'}))
  mS(m).forEach(si => Object.assign(si, {selected: 0, selection: 's'}))
  mC(m).forEach(ci => Object.assign(ci, {selected: 0, selection: 's'}))
}

export const unselectR = (ri: R) => {
  ri.selected = 0
}

export const unselectS = (si: S) => {
  si.selected = 0
}

export const unselectC = (ci: C) => {
  ci.selected = 0
}
