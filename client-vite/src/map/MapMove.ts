import {genHash} from "../core/Utils";
import {GN, M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete";
import {selectNode, unselectNodes} from "./MapSelect";
import {cb2ipS, cb2ipCC, cb2ipCR, getCountSO1, getReselectS, getXA, getXP, m2cbCC, m2cbCR, m2cbS, makeSpaceFromCC, makeSpaceFromCR, makeSpaceFromS, sortPath,} from "./MapUtils"

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
  m.push(...cb2ipS(cb, insertPath))
  m.sort(sortPath)
}

export const moveS = (m: M, insertPath: P) => {
  const cb = m2cbS(m)
  deleteS(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ipS(cb, insertPath))
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
