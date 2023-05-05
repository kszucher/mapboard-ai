import {genHash} from "../core/Utils";
import {GN, M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete";
import {selectNode, unselectNodes} from "./MapSelect";
import {
  cb2ip,
  cb2ipCC,
  cb2ipCR,
  getCountCXL,
  getCountCXU,
  getCountR0D0S,
  getCountR0D1S,
  getCountSO1,
  getCountSXAD,
  getCountSXAU,
  getCountSXAU1O1,
  getCountSXI1U, getReselectS,
  getSXAU1,
  getSXI1,
  getSXI2,
  getXA,
  getXP,
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

export const cutS = (m: M) => {
  const reselectPath = getReselectS(m)
  const cb = m2cbS(m)
  cbSave(cb)
  deleteS(m)
  selectNode(m, reselectPath, 's')
}

export const copyS = (m: M) => {
  const cb = m2cbS(m)
  cbSave(cb)
}

export const pasteS = (m: M, payload: any) => {
  const cb = JSON.parse(payload.text) as GN[]
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  const insertPath = [...getXP(m), 's', getCountSO1(m, getXP(m))] as P
  unselectNodes(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

export const moveS = (m: M, insertPath: P) => {
  const cb = m2cbS(m)
  deleteS(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ip(cb, insertPath))
  m.sort(sortPath)
}

export const moveCR = (m: M, insertPath: P) => {
  const cb = m2cbCR(m)
  deleteCR(m)
  makeSpaceFromCR(m, insertPath)
  m.push(...cb2ipCR(cb, insertPath))
  m.sort(sortPath)
}

export const moveCC = (m: M, insertPath: P) => {
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
