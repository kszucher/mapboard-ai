import {genHash} from "./Utils"
import {GN, M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {selectNode, unselectNodes} from "./MapSelect"
import {cb2ipS, cb2ipCC, cb2ipCR, getCountSS, getReselectS, getXA, getXP, m2cbCC, m2cbCR, m2cbS, makeSpaceFromCC, makeSpaceFromCR, makeSpaceFromS, sortPath, getNodeById, getSI1, getNodeByPath,} from "./MapUtils"

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
  const cb = JSON.parse(payload) as GN[]
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  const insertPath = [...getXP(m), 's', getCountSS(m, getXP(m))] as P
  unselectNodes(m)
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ipS(cb, insertPath))
  m.sort(sortPath)
}

export const moveS = (m: M, insertTargetPath: P, insertTargetIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbS(m)
  deleteS(m)
  const insertPath = [...getNodeById(m, insertTargetNodeId).path, 's', insertTargetIndex] as P
  makeSpaceFromS(m, insertPath, getXA(cb).length)
  m.push(...cb2ipS(cb, insertPath))
  m.sort(sortPath)
}

export const moveCR = (m: M, insertTargetPath: P, insertTargetRowIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbCR(m)
  deleteCR(m)
  const insertPath = [...getNodeById(m, insertTargetNodeId).path, 'c', insertTargetRowIndex, 0] as P
  makeSpaceFromCR(m, insertPath)
  m.push(...cb2ipCR(cb, insertPath))
  m.sort(sortPath)
}

export const moveCC = (m: M, insertTargetPath: P, insertTargetColIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbCC(m)
  deleteCC(m)
  const insertPath = [...getNodeById(m, insertTargetNodeId).path, 'c', 0, insertTargetColIndex] as P
  makeSpaceFromCC(m, insertPath)
  m.push(...cb2ipCC(cb, insertPath))
  m.sort(sortPath)
}
