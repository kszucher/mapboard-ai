import {genHash} from "../core/Utils";
import {M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete";
import {
  cb2ip,
  cb2ipCC,
  cb2ipCR,
  getCountCXL,
  getCountCXU,
  getCountR0D0S,
  getCountR0D1S,
  getCountSXAD,
  getCountSXAU,
  getCountSXAU1O1,
  getCountSXI1U,
  getSXAU1,
  getSXI1,
  getSXI2,
  getXA,
  m2cbCC,
  m2cbCR,
  m2cbS,
  makeSpaceFromCC,
  makeSpaceFromCR,
  makeSpaceFromS,
  sortPath,
} from "./MapUtils"

const cbSave = (cb: any) => {
  navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard
        .writeText(JSON.stringify(cb, undefined, 4))
        .then(() => {
          console.log('moved to clipboard')
        })
        .catch(err => {
          console.error('move to clipboard error: ', err)
        })
    }
  })
}

const moveS = (m: M, insertPath: P) => {
  const cb = m2cbS(m)
  deleteS(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

const cutS = (m: M) => {
  const cb = m2cbS(m)
  deleteS(m)
  cbSave(cb)
}

const copyS = (m: M) => {
  const cb = m2cbS(m)
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  cbSave(cb)
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

export const moveSD = (m: M) => moveS(m, [...getSXI1(m), 's', getCountSXAU(m) + 1])
export const moveST = (m: M) => moveS(m, [...getSXI1(m), 's', 0])
export const moveSU = (m: M) => moveS(m, [...getSXI1(m), 's', getCountSXAU(m) - 1])
export const moveSB = (m: M) => moveS(m, [...getSXI1(m), 's', getCountSXAD(m)])
export const moveSO = (m: M) => moveS(m, [...getSXAU1(m), 's', getCountSXAU1O1(m)])
export const moveSI = (m: M) => moveS(m, [...getSXI2(m), 's', getCountSXI1U(m) + 1])
export const moveSIR = (m: M) => moveS(m, ['r', 0, 'd', 1, 's', getCountR0D1S(m)])
export const moveSIL = (m: M) => moveS(m, ['r', 0, 'd', 0, 's', getCountR0D0S(m)])
export const moveCRD = (m: M) => moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) + 1, 0])
export const moveCRU = (m: M) => moveCR(m, [...getSXI1(m), 'c', getCountCXU(m) - 1, 0])
export const moveCCR = (m: M) => moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) + 1])
export const moveCCL = (m: M) => moveCC(m, [...getSXI1(m), 'c', 0, getCountCXL(m) - 1])
