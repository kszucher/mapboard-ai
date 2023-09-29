import {ccToCb, crToCb, getCountTSCH, getCountTSCV, getCountXASU, getNodeById, getReselectR, getReselectS, getXA, getXSI1, lToCb, mL, mT, rToCb, sortPath, sToCb} from "../selectors/MapSelector"
import {M, T, PT, L, PL, PTR} from "../state/MapStateTypes"
import {generateCharacterFrom, genHash, IS_TESTING} from "../utils/Utils"
import {mapDeInit} from "./MapDeInit"
import {deleteCC, deleteCR, deleteLR, deleteS} from "./MapDelete"
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

export const cutLR = (m: M) => {
  const reselect = getReselectR(m)
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  cbSave(mapDeInit([...cbL, ...cbR]))
  deleteLR(m)
  selectNode(m, reselect, 's')
}

export const cutS = (m: M) => {
  const reselect = getReselectS(m)
  const cbS = structuredClone(sToCb(m))
  cbSave(mapDeInit(cbS))
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const copyLR = (m: M) => {
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  cbSave(mapDeInit([...cbL, ...cbR]))
}

export const copyS = (m: M) => {
  const cbS = structuredClone(sToCb(m))
  cbSave(mapDeInit(cbS))
}

const cbToLR = (m: M, cbL: L[], cbR: M, ipL: PL, ipR: PTR) => {
  const nodeIdMappingR = cbR.map((ti, i) => ({
    oldNodeId: ti.nodeId,
    newNodeId: IS_TESTING ? generateCharacterFrom('u', i) : 'node' + genHash(8)
  }))
  cbL.forEach((li, i) => Object.assign(li, {
    nodeId: IS_TESTING ? generateCharacterFrom('r', i) : 'node' + genHash(8),
    path : ['l', (li.path.at(1) as number) + (ipL.at(-1) as number)],
    fromNodeId : nodeIdMappingR.find(el => el.oldNodeId === li.fromNodeId)?.newNodeId || li.fromNodeSide,
    toNodeId: nodeIdMappingR.find(el => el.oldNodeId === li.toNodeId)?.newNodeId || li.nodeId
  }))
  cbR.forEach((ti, i) => Object.assign(ti, {
    nodeId: nodeIdMappingR[i].newNodeId,
    path: ['r', (ti.path.at(1) as number) + (ipR.at(-1) as number), ...ti.path.slice(2)],
    // TODO: assign offset
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbR)
  m.sort(sortPath)
}

const cbToS = (m: M, cbS: M, ip: PT) => {
  cbS.forEach((ti, i) => Object.assign(ti, {
    nodeId: IS_TESTING ? generateCharacterFrom('u', i) : 'node' + genHash(8),
    path : [...ip.slice(0, -2), 's', (ti.path.at(1) as number) + (ip.at(-1) as number), ...ti.path.slice(2)]
  }))
  makeSpaceFromS(m, ip, getXA(cbS).length)
  unselectNodes(m)
  m.push(...cbS)
  m.sort(sortPath)
}

export const pasteLR = (m: M, payload: any) => {
  const ipL = ['l', mL(m).at(-1)!.path.at(1) as number + 1] as PL
  const ipR = ['r', mT(m).at(-1)!.path.at(1) as number + 1] as PTR
  const cbLR = JSON.parse(payload) as M
  const cbL = mL(cbLR)
  const cbR = mT(cbLR)
  cbToLR(m, cbL, cbR, ipL, ipR)
}

export const pasteS = (m: M, insertParentNode: T, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  const cbS = JSON.parse(payload) as M
  cbToS(m, cbS, ip)
}

export const duplicateR = (m: M) => {
  const ipL = ['l', mL(m).at(-1)!.path.at(1) as number + 1] as PL
  const ipR = ['r', mT(m).at(-1)!.path.at(1) as number + 1] as PTR
  const cbL = structuredClone(lToCb(m)) as L[]
  const cbR = structuredClone(rToCb(m))
  cbToLR(m, cbL, cbR, ipL, ipR)
}

export const duplicateS = (m: M) => {
  const ip = [...getXSI1(m).path, 's', getCountXASU(m) + getXA(m).length] as PT
  const cbS = structuredClone(sToCb(m))
  cbToS(m, cbS, ip)
}

export const moveS = (m: M, insertParentNode: T, insertTargetIndex: number) => {
  const insertParentNodeId = insertParentNode.nodeId
  const cbS = structuredClone(sToCb(m))
  deleteS(m)
  const ip = [...getNodeById(m, insertParentNodeId).path, 's', insertTargetIndex] as PT
  cbS.forEach((ti, i) => Object.assign(ti, {
    path : [...ip.slice(0, -2), 's', (ti.path.at(1) as number) + (ip.at(-1) as number), ...ti.path.slice(2)]
  }))
  makeSpaceFromS(m, ip, getXA(cbS).length)
  m.push(...cbS)
  m.sort(sortPath)
}

export const moveCR = (m: M, insertParentNode: T, insertTargetRowIndex: number) => {
  const insertParentNodeId = insertParentNode.nodeId
  const cbCr = structuredClone(crToCb(m))
  deleteCR(m)
  const ip = [...getNodeById(m, insertParentNodeId).path, 'c', insertTargetRowIndex, 0] as PT
  const ipList = Array(getCountTSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as PT)
  cbCr.forEach(ti => Object.assign(ti, {
    path: [...ip.slice(0, -3), 'c', (ti.path.at(1) as number) + (ip.at(-2) as number), (ti.path.at(2) as number), ...ti.path.slice(3)]
  }))
  makeSpaceFromCr(m, ipList, 1)
  m.push(...cbCr)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: T, insertTargetColumnIndex: number) => {
  const insertParentNodeId = insertParentNode.nodeId
  const cbCc = structuredClone(ccToCb(m))
  deleteCC(m)
  const ip = [...getNodeById(m, insertParentNodeId).path, 'c', 0, insertTargetColumnIndex] as PT
  const ipList = Array(getCountTSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as PT)
  cbCc.forEach(ti => Object.assign(ti, {
    path: [...ip.slice(0, -3), 'c', (ti.path.at(1) as number), (ti.path.at(2) as number) + (ip.at(-1) as number), ...ti.path.slice(3)]
  }))
  makeSpaceFromCc(m, ipList, 1)
  m.push(...cbCc)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: T, moveNodes: T[]) => {
  const insertParentNodeId = insertParentNode.nodeId
  selectNodeList(m, moveNodes, 's')
  const cbS = structuredClone(sToCb(m))
  deleteS(m)
  cbS.forEach(ti => Object.assign(ti, {
    selected: 0,
    path: [...getNodeById(m, insertParentNodeId).path, 's', 0, 'c', ti.path.at(1), 0, 's', 0, ...ti.path.slice(2)] as PT
  }))
  insertTable(m, insertParentNode, 0, {rowLen: moveNodes.length, colLen: 1})
  m.push(...cbS)
  m.sort(sortPath)
}
