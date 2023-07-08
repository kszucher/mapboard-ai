import {insertTable} from "./MapInsert"
import {genHash} from "./Utils"
import {M, P} from "../state/MapPropTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"
import {cb2ipS, cb2ipCC, cb2ipCR, getReselectS, getXA, getXP, m2cbCC, m2cbCR, m2cbS, makeSpaceFromCC, makeSpaceFromCR, makeSpaceFromS, sortPath, getNodeById, getNodeByPath, getXSS} from "./MapUtils"

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

export const pasteS = (m: M, insertTargetPath: P, insertTargetIndex: number, payload: any) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = JSON.parse(payload) as M
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  const insertPath = [...getNodeById(m, insertTargetNodeId).path, 's', insertTargetIndex] as P
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

export const moveS2T = (m: M) => {
  const insertTargetNodeId = getNodeByPath(m, getXP(m)).nodeId
  const rowLen = getXSS(m).length
  selectNodeList(m, getXSS(m).map(n => n.path), 's')
  const cb = m2cbS(m)
  deleteS(m)
  insertTable(m, [...getNodeById(m, insertTargetNodeId).path, 's', 0], {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {selected: 0, selection: 's', path: [...getXP(m), 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P}))
  m.push(...cb)
  m.sort(sortPath)
}
