import {ccToCb, crToCb, getCountNSCH, getCountNSCV, getCountXASU, getReselectR, getReselectS, getXA, getXSI1, rToCb, sortPath, sToCb} from "../selectors/MapSelector"
import {M, T, P} from "../state/MapStateTypes"
import {generateCharacter, genHash, IS_TESTING} from "../utils/Utils"
import {mapDeInit} from "./MapDeInit"
import {deleteCC, deleteCR, deleteR, deleteS} from "./MapDelete"
import {insertTable} from "./MapInsert"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"
import {makeSpaceFromCc, makeSpaceFromCr, makeSpaceFromS} from "./MapSpace"

const formatCb = (arr: any[]) => "[\n" + arr.map((e: any) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

const cbSave = (cb: any) => {
  navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard
        .writeText(formatCb(cb))
        .then(() => {
          console.log('moved to clipboard')
        })
        .catch(err => {
          console.error('move to clipboard error: ', err)
        })
    }
  })
}

const clearNodeId = (m: M) => m.forEach((n, i) => n.nodeId = IS_TESTING ? generateCharacter(i) : 'node' + genHash(8))
const insertPathFromIpR = (m: M, ip: P) => m.forEach((n, i) => Object.assign(n, {path : ['r', (n.path.at(1) as number) + (ip.at(-1) as number), ...n.path.slice(2)]}))
const insertPathFromIpS = (m: M, ip: P) => m.forEach((n, i) => Object.assign(n, {path : [...ip.slice(0, -2), 's', (n.path.at(1) as number) + (ip.at(-1) as number), ...n.path.slice(2)]}))
const insertPathFromIpCr = (m: M, ip: P) => m.forEach((n, i) => Object.assign(n, {path: [...ip.slice(0, -3), 'c', (n.path.at(1) as number) + (ip.at(-2) as number), (n.path.at(2) as number), ...n.path.slice(3)]}))
const insertPathFromIpCc = (m: M, ip: P) => m.forEach((n, i) => Object.assign(n, {path: [...ip.slice(0, -3), 'c', (n.path.at(1) as number), (n.path.at(2) as number) + (ip.at(-1) as number), ...n.path.slice(3)]}))

export const cutR = (m: M) => {
  const reselect = getReselectR(m)
  const cb = structuredClone(sToCb(m)) as M
  cbSave(cb)
  deleteR(m)
  selectNode(m, reselect, 's')
}

export const cutS = (m: M) => {
  const reselect = getReselectS(m)
  const cb = structuredClone(sToCb(m))
  cbSave(cb)
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const copyR = (m: M) => {
  const cb = structuredClone(rToCb(m))
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const copyS = (m: M) => {
  const cb = structuredClone(sToCb(m))
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertParentNode: T, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = JSON.parse(payload) as M
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  clearNodeId(cb)
  insertPathFromIpS(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const pasteR = (m: M) => {

}

export const duplicateR = (m: M) => {
  const ip = ['r', m.at(-1)!.path.at(1) as number + 1] as P
  const cb = structuredClone(rToCb(m))
  unselectNodes(m)
  clearNodeId(cb)
  insertPathFromIpR(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const duplicateS = (m: M) => {
  const ip = [...getXSI1(m).path, 's', getCountXASU(m) + getXA(m).length] as P
  const cb = structuredClone(sToCb(m))
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  clearNodeId(cb)
  insertPathFromIpS(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveS = (m: M, insertParentNode: T, insertTargetIndex: number) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = structuredClone(sToCb(m))
  deleteS(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  insertPathFromIpS(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveCR = (m: M, insertParentNode: T, insertTargetRowIndex: number) => {
  const ip = [...insertParentNode.path, 'c', insertTargetRowIndex, 0] as P
  const ipList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  const cb = structuredClone(crToCb(m))
  deleteCR(m)
  makeSpaceFromCr(m, ipList, 1)
  insertPathFromIpCr(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: T, insertTargetColumnIndex: number) => {
  const ip = [...insertParentNode.path, 'c', 0, insertTargetColumnIndex] as P
  const ipList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  const cb = structuredClone(ccToCb(m))
  deleteCC(m)
  makeSpaceFromCc(m, ipList, 1)
  insertPathFromIpCc(cb, ip)
  m.push(...cb)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: T, moveNodes: T[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes, 's')
  const cb = structuredClone(sToCb(m))
  deleteS(m)
  insertTable(m, insertParentNode, 0, {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {selected: 0, path: [...insertParentNode.path, 's', 0, 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P}))
  m.push(...cb)
  m.sort(sortPath)
}
