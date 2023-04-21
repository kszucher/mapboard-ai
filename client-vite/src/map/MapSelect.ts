import isEqual from "react-fast-compare"
import {M, P} from "../state/MapPropTypes"
import {getLS} from "./MapUtils"

export const selectNode = (m: M, path: P, selection: 's' | 'f') => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path)
    ? {selected: 1, selection}
    : {selected: 0, selection: 's'}
  ))
}
export const selectNodeToo = (m: M, path: P, selection: 's' | 'f') => {
  m.forEach(n => Object.assign(n, n.path.length > 1 && isEqual(n.path, path)
    ? {selected: getLS(m).selected + 1, selection}
    : {}
  ))
}
export const selectNodeList = (m: M, pList: P[], selection: 's' | 'f') => {
  m.forEach((n, i) => Object.assign(n, n.path.length > 1 && pList.map(p => p.join('')).includes(n.path.join(''))
    ? {selected: i, selection}
    : {selected: 0, selection: 's'}
  ))
}
