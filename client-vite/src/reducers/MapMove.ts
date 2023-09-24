import {ccToCb, crToCb, getCountNSCH, getCountNSCV, getCountXASU, getReselectR, getReselectS, getXA, getXSI1, lToCb, mL, mT, rToCb, sortPath, sToCb} from "../selectors/MapSelector"
import {M, T, P} from "../state/MapStateTypes"
import {generateCharacterFrom, genHash, IS_TESTING} from "../utils/Utils"
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

export const cutR = (m: M) => {
  const reselect = getReselectR(m)
  const cbR = structuredClone(rToCb(m)) as M
  cbSave(cbR)
  deleteR(m)
  selectNode(m, reselect, 's')
}

export const cutS = (m: M) => {
  const reselect = getReselectS(m)
  const cbS = structuredClone(sToCb(m))
  cbSave(cbS)
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const copyR = (m: M) => {
  const cbR = structuredClone(rToCb(m))
  const cbDeInit = mapDeInit(cbR)
  cbSave(cbDeInit)
}

export const copyS = (m: M) => {
  const cbS = structuredClone(sToCb(m))
  const cbDeInit = mapDeInit(cbS)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertParentNode: T, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cbS = JSON.parse(payload) as M
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cbS).length)
  cbS.forEach((t, i) => Object.assign(t, {
    nodeId: IS_TESTING ? generateCharacterFrom('u', i) : 'node' + genHash(8),
    path : [...ip.slice(0, -2), 's', (t.path.at(1) as number) + (ip.at(-1) as number), ...t.path.slice(2)]
  }))
  m.push(...cbS)
  m.sort(sortPath)
}

export const pasteR = (m: M) => {

}

export const duplicateR = (m: M) => {
  const ipL = ['l', mL(m).at(-1)!.path.at(1) as number + 1] as P
  const ipR = ['r', mT(m).at(-1)!.path.at(1) as number + 1] as P
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  const nodeIdMappingR = cbR.map((t, i) => ({
    oldNodeId: t.nodeId,
    newNodeId: IS_TESTING ? generateCharacterFrom('u', i) : 'node' + genHash(8)
  }))
  cbL.forEach((l, i) => Object.assign(l, {
    nodeId: IS_TESTING ? generateCharacterFrom('r', i) : 'node' + genHash(8),
    path : ['l', (l.path.at(1) as number) + (ipL.at(-1) as number)],
    fromNodeId : nodeIdMappingR.find(el => el.oldNodeId === l.fromNodeId)?.newNodeId || l.fromNodeSide,
    toNodeId: nodeIdMappingR.find(el => el.oldNodeId === l.toNodeId)?.newNodeId || l.nodeId
  }))
  cbR.forEach((t, i) => Object.assign(t, {
    nodeId: nodeIdMappingR[i].newNodeId,
    path: ['r', (t.path.at(1) as number) + (ipR.at(-1) as number), ...t.path.slice(2)],
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbR)
  m.sort(sortPath)
}

export const duplicateS = (m: M) => {
  const ip = [...getXSI1(m).path, 's', getCountXASU(m) + getXA(m).length] as P
  const cbS = structuredClone(sToCb(m))
  cbS.forEach((t, i) => Object.assign(t, {
    nodeId: IS_TESTING ? generateCharacterFrom('u', i) : 'node' + genHash(8),
    path : [...ip.slice(0, -2), 's', (t.path.at(1) as number) + (ip.at(-1) as number), ...t.path.slice(2)]
  }))
  makeSpaceFromS(m, ip, getXA(cbS).length)
  unselectNodes(m)
  m.push(...cbS)
  m.sort(sortPath)
}

export const moveS = (m: M, insertParentNode: T, insertTargetIndex: number) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cbS = structuredClone(sToCb(m))
  cbS.forEach((t, i) => Object.assign(t, {
    path : [...ip.slice(0, -2), 's', (t.path.at(1) as number) + (ip.at(-1) as number), ...t.path.slice(2)]
  }))
  deleteS(m)
  makeSpaceFromS(m, ip, getXA(cbS).length)
  m.push(...cbS)
  m.sort(sortPath)
}

export const moveCR = (m: M, insertParentNode: T, insertTargetRowIndex: number) => {
  const ip = [...insertParentNode.path, 'c', insertTargetRowIndex, 0] as P
  const ipList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  const cbCr = structuredClone(crToCb(m))
  cbCr.forEach(t => Object.assign(t, {
    path: [...ip.slice(0, -3), 'c', (t.path.at(1) as number) + (ip.at(-2) as number), (t.path.at(2) as number), ...t.path.slice(3)]
  }))
  deleteCR(m)
  makeSpaceFromCr(m, ipList, 1)
  m.push(...cbCr)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: T, insertTargetColumnIndex: number) => {
  const ip = [...insertParentNode.path, 'c', 0, insertTargetColumnIndex] as P
  const ipList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  const cbCc = structuredClone(ccToCb(m))
  cbCc.forEach(t => Object.assign(t, {
    path: [...ip.slice(0, -3), 'c', (t.path.at(1) as number), (t.path.at(2) as number) + (ip.at(-1) as number), ...t.path.slice(3)]
  }))
  deleteCC(m)
  makeSpaceFromCc(m, ipList, 1)
  m.push(...cbCc)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: T, moveNodes: T[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes, 's')
  const cbS = structuredClone(sToCb(m))
  cbS.forEach(t => Object.assign(t, {selected: 0, path: [...insertParentNode.path, 's', 0, 'c', t.path.at(1), 0, 's', 0, ...t.path.slice(2)] as P}))
  deleteS(m)
  insertTable(m, insertParentNode, 0, {rowLen, colLen: 1})
  m.push(...cbS)
  m.sort(sortPath)
}
