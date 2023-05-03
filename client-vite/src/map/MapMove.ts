import {M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete";
import {
  sortPath,
  m2cb,
  getSXAU1,
  getCountSXAU1O1,
  cb2ip,
  getCountR0D1S,
  getCountR0D0S,
  getSXI1,
  makeSpaceFrom,
  getCountSXAD,
  getSXAD1,
  getSXAD2,
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
  getCountCXL,
} from "./MapUtils"

const moveS = (m: M, spacePath: P, insertPath: P) => {
  const cb = m2cb(m)
  makeSpaceFrom(m, spacePath)
  deleteS(m)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

const moveCR = (m: M, spacePath: P, insertPath: P) => {
  const cb = m2cbCR(m)
  makeSpaceFromCR(m, spacePath)
  deleteCR(m)
  m.push(...cb2ipCR(cb, insertPath))
  m.sort(sortPath)
}

const moveCC = (m: M, spacePath: P, insertPath: P) => {
  const cb = m2cbCC(m)
  makeSpaceFromCC(m, spacePath)
  deleteCC(m)
  m.push(...cb2ipCC(cb, insertPath))
  m.sort(sortPath)
}

export const moveSD = (m: M) => moveS(m, getSXAD2(m), getSXAD1(m))
export const moveST = (m: M) => moveS(m, [...getSXI1(m), 's', 0], [...getSXI1(m), 's', 0])
export const moveSU = (m: M) => moveS(m, getSXAU1(m), getSXAU1(m))
export const moveSB = (m: M) => moveS(m, [], [...getSXI1(m), 's', getCountSXAD(m)])
export const moveSO = (m: M) => moveS(m, [], [...getSXAU1(m), 's', getCountSXAU1O1(m)])
export const moveSI = (m: M) => moveS(m, getSXI1D1(m), getSXI1D1(m))
export const moveSIR = (m: M) => moveS(m, [], ['r', 0, 'd', 1, 's', getCountR0D1S(m)])
export const moveSIL = (m: M) => moveS(m, [], ['r', 0, 'd', 0, 's', getCountR0D0S(m)])

export const moveCRD = (m: M) => moveCR(m, [...getSI1(getXP(m)), 'c', getCountCXU(m) + 2, 0], [...getSI1(getXP(m)), 'c', getCountCXU(m) + 1, 0])
export const moveCRU = (m: M) => moveCR(m, [...getSI1(getXP(m)), 'c', getCountCXU(m) - 1, 0], [...getSI1(getXP(m)), 'c', getCountCXU(m) - 1, 0])
export const moveCCR = (m: M) => moveCC(m, [...getSI1(getXP(m)), 'c', 0, getCountCXL(m) + 2], [...getSI1(getXP(m)), 'c', 0, getCountCXL(m) + 1])
export const moveCCL = (m: M) => moveCC(m, [...getSI1(getXP(m)), 'c', 0, getCountCXL(m) - 1], [...getSI1(getXP(m)), 'c', 0, getCountCXL(m) -1])
