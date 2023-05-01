import {M, P} from "../state/MapPropTypes"
import {deleteS} from "./MapDelete";
import {sortPath, m2cb, getXFSU1, getCountXFSU1SO1, cb2ip, getCountR0D1S, getCountR0D0S, getXI1, makeSpaceFrom, getCountXLSD, getXFPSU1, getXFPSD1, getXLPSD2, getXI1D1} from "./MapUtils"

export const moveS = (m: M, spacePath: P, insertPath: P) => {
  const cb = m2cb(m)
  makeSpaceFrom(m, spacePath)
  deleteS(m)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

export const moveSO = (m: M) => moveS(m, [], [...getXFSU1(m), 's', getCountXFSU1SO1(m)])
export const moveSI = (m: M) => moveS(m, getXI1D1(m), getXI1D1(m))
export const moveSIR = (m: M) => moveS(m, [], ['r', 0, 'd', 1, 's', getCountR0D1S(m)])
export const moveSIL = (m: M) => moveS(m, [], ['r', 0, 'd', 0, 's', getCountR0D0S(m)])
export const moveSD = (m: M) => moveS(m, getXLPSD2(m), getXFPSD1(m))
export const moveST = (m: M) => moveS(m, [...getXI1(m), 's', 0], [...getXI1(m), 's', 0])
export const moveSU = (m: M) => moveS(m, getXFPSU1(m), getXFPSU1(m))
export const moveSB = (m: M) => moveS(m, [], [...getXI1(m), 's', getCountXLSD(m)])

export const moveCCR = (m: M) => {
  // const cb = m2cb(m) // TODO use appropriate cutter
  // TODO use appropriate incrementer
  // deleteStuff(m) // TODO use appropriate DELETER
  // m.push(...cb2ip(cb, insertPath)) // TODO use appropriate paster
  // m.sort(sortPath)
}

export const moveCCL = (m: M) => {

}

export const moveCRD = (m: M) => {

}

export const moveCRU = (m: M) => {

}
