import {M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete";
import {
  sortPath,
  m2cbS,
  getSXAU1,
  getCountSXAU1O1,
  cb2ip,
  getCountR0D1S,
  getCountR0D0S,
  getSXI1,
  makeSpaceFromS,
  getCountSXAD,
  getSXAD1,
  getSXI1D1,
  getSI1,
  getXP,
  m2cbCR,
  cb2ipCR,
  getCountCXU,
  makeSpaceFromCR,
  m2cbCC,
  makeSpaceFromCC,
  cb2ipCC,
  getCountCXL, getXA,
} from "./MapUtils"

const moveS = (m: M, insertPath: P) => {
  const cb = m2cbS(m)
  deleteS(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

const cutS = (m: M) => {
  const cb = m2cbS(m)

}

const copyS = (m: M) => {

}

const pasteS = (m: M) => {

}

const moveCR = (m: M, insertPath: P) => {
  const cb = m2cbCR(m)
  deleteCR(m)
  makeSpaceFromCR(m, insertPath)
  m.push(...cb2ipCR(cb, insertPath))
  m.sort(sortPath)
}

const moveCC = (m: M, insertPath: P) => {
  const cb = m2cbCC(m)
  deleteCC(m)
  makeSpaceFromCC(m, insertPath)
  m.push(...cb2ipCC(cb, insertPath))
  m.sort(sortPath)
}

export const moveSD = (m: M) => moveS(m, getSXAD1(m))
export const moveST = (m: M) => moveS(m, [...getSXI1(m), 's', 0])
export const moveSU = (m: M) => moveS(m, getSXAU1(m))
export const moveSB = (m: M) => moveS(m, [...getSXI1(m), 's', getCountSXAD(m)])
export const moveSO = (m: M) => moveS(m, [...getSXAU1(m), 's', getCountSXAU1O1(m)])
export const moveSI = (m: M) => moveS(m, getSXI1D1(m))
export const moveSIR = (m: M) => moveS(m, ['r', 0, 'd', 1, 's', getCountR0D1S(m)])
export const moveSIL = (m: M) => moveS(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)])

export const moveCRD = (m: M) => moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) + 1, 0])
export const moveCRU = (m: M) => moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) - 1, 0])
export const moveCCR = (m: M) => moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) + 1])
export const moveCCL = (m: M) => moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) - 1])
