import {mapDeInit} from "./MapDeInit";
import {insertTable} from "./MapInsert"
import {genHash} from "./Utils"
import {M, N, P} from "../state/MapStateTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"
import {cb2ipS, cb2ipCC, cb2ipCR, getReselectS, getXA, getXP, m2cbCC, m2cbCR, m2cbS, makeSpaceFromCC, makeSpaceFromCR, makeSpaceFromS, sortPath, getNodeById, getNodeByPath, getXSO1, m2cbR} from "./MapUtils"

const templateReady = (arr: any[]) => "[\n" + arr.map((e: any) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

const showTemplate = (m: M) => {
  console.log(
    '' + m.map(n => ('\n{' +
      'selected: ' + JSON.stringify(n.selected) + ', ' +
      'selection: ' + JSON.stringify(n.selection) + ', ' +
      `nodeId: 'node' + genHash(8)` + ', ' +
      `path: ["r",ri,${JSON.stringify(n.path.slice(2)).slice(1, -1)}]` + ', ' +
      'content: ' + JSON.stringify(n.content) + ', ' +
      'sFillColor: ' + JSON.stringify(n.sFillColor) +
      '} as GN'
    ))
  )
}

const cbSave = (cb: any) => {
  navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard
        .writeText(templateReady(cb))
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

export const copyR = (m: M) => {
  const cb = m2cbR(m)
  showTemplate(cb)
  // const cbDeInit = mapDeInit(cb)
  // cbSave(cbDeInit)
  // TODO uncomment these when paste can detect and load R
}

export const copyS = (m: M) => {
  const cb = m2cbS(m)
  showTemplate(cb)
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertTargetPath: P, insertTargetIndex: number, payload: any) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = JSON.parse(payload) as M
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  const ip = [...getNodeById(m, insertTargetNodeId).path, 's', insertTargetIndex] as P
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  m.push(...cb2ipS(cb, ip))
  m.sort(sortPath)
}

export const moveS = (m: M, insertTargetPath: P, insertTargetIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbS(m)
  deleteS(m)
  const ip = [...getNodeById(m, insertTargetNodeId).path, 's', insertTargetIndex] as P
  makeSpaceFromS(m, ip, getXA(cb).length)
  m.push(...cb2ipS(cb, ip))
  m.sort(sortPath)
}

export const moveCR = (m: M, insertTargetPath: P, insertTargetRowIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbCR(m)
  deleteCR(m)
  const ip = [...getNodeById(m, insertTargetNodeId).path, 'c', insertTargetRowIndex, 0] as P
  makeSpaceFromCR(m, ip)
  m.push(...cb2ipCR(cb, ip))
  m.sort(sortPath)
}

export const moveCC = (m: M, insertTargetPath: P, insertTargetColIndex: number) => {
  const insertTargetNodeId = getNodeByPath(m, insertTargetPath).nodeId
  const cb = m2cbCC(m)
  deleteCC(m)
  const ip = [...getNodeById(m, insertTargetNodeId).path, 'c', 0, insertTargetColIndex] as P
  makeSpaceFromCC(m, ip)
  m.push(...cb2ipCC(cb, ip))
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: N, moveNodes: N[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes.map(n => n.path), 's')
  const cb = m2cbS(m)
  deleteS(m)
  insertTable(m, [...insertParentNode.path, 's', 0], {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {selected: 0, selection: 's', path: [...insertParentNode.path, 's', 0, 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P}))
  m.push(...cb)
  m.sort(sortPath)
}
