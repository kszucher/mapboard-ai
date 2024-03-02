import {N, LPartial, M, T, PT, MPartial, C, PC} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {sortPath, isSEODO, getLastIndexL, mT, getLastIndexR, getG, getXS, isXAS, getXAC, getNodeById, getXC} from "../queries/MapQueries.ts"
import {generateCharacterFrom, genHash, getTableIndices, IS_TESTING} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"

export const insertL = (m: M, lPartial: LPartial) => {
  m.push({...lPartial, nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ['l', getLastIndexL(m) + 1]} as N)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  const newRoot = [
    {nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH},
    {nodeId: IS_TESTING ? 'u' : 'node' + genHash(8), path: ['r', lastIndexR + 1, 's', 0], content: 'New Root'},
  ] as MPartial
  unselectNodes(m)
  m.push(...newRoot as M)
  m.sort(sortPath)
}

export const insertS = (m: M, insertParentNode: T, insertTargetIndex: number, attributes: object) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  mT(m).forEach(ti => isSEODO(ip, ti.path) && ti.path.splice(ip.length - 1, 1, ti.path.at(ip.length - 1) + 1))
  const parentTaskStatus = isXAS(m) ? getXS(m).taskStatus : sSaveOptional.taskStatus
  unselectNodes(m)
  m.push({selected: 1, nodeId: IS_TESTING ? 'xt_' : 'node' + genHash(8), path: ip, taskStatus: parentTaskStatus, ...attributes} as N)
  m.sort(sortPath)
}

export const insertCRD = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const toMoveD = getXAC(m).flatMap(ci => ci.cd).map(nid => getNodeById(m, nid) as C).flatMap(ci => [ci.nodeId, ...ci.so]).map(nid => getNodeById(m, nid))
  toMoveD.forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  m.push(...getXAC(m).map((ci, i) => ({nodeId: genNodeId(i), path: ci.path.with(crIndex, crValue + 1)} as N)))
  m.sort(sortPath)
}

export const insertCRU = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const toMoveD = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cd]).map(nid => getNodeById(m, nid) as C).flatMap(ci => [ci.nodeId, ...ci.so]).map(nid => getNodeById(m, nid))
  toMoveD.forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  m.push(...getXAC(m).map((ci, i) => ({nodeId: genNodeId(i), path: ci.path.with(crIndex, crValue)} as N)))
  m.sort(sortPath)
}

export const insertCCR = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const toMoveR = getXAC(m).flatMap(ci => ci.cr).map(nid => getNodeById(m, nid) as C).flatMap(ci => [ci.nodeId, ...ci.so]).map(nid => getNodeById(m, nid))
  toMoveR.forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map((ci, i) => ({nodeId: genNodeId(i), path: ci.path.with(ccIndex, ccValue + 1)} as N)))
  m.sort(sortPath)
}

export const insertCCL = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const toMoveR = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cr]).map(nid => getNodeById(m, nid) as C).flatMap(ci => [ci.nodeId, ...ci.so]).map(nid => getNodeById(m, nid))
  toMoveR.forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map((ci, i) => ({nodeId: genNodeId(i), path: ci.path.with(ccIndex, ccValue)} as N)))
  m.sort(sortPath)
}

export const insertSCRD = (m: M) => {
  const sc00 = getNodeById(m, getXS(m).co1.at(0) as string) as C
  m.push(...Array.from({length: sc00.ch.length}, (_, i) =>({nodeId: genNodeId(i), path: [...getXS(m).path, 'c', sc00.cv.length, i] as PC} as N)))
  m.sort(sortPath)
}

export const insertSCRU = (m: M) => {
  const crIndex = getXS(m).path.length + 1
  const toMoveD = [...getXS(m).co1, ...getXS(m).co1.map(nid => getNodeById(m, nid) as C).flatMap(el => el.so)].map(nid => getNodeById(m, nid))
  toMoveD.forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  const sc00 = getNodeById(m, getXS(m).co1.at(0) as string) as C
  m.push(...Array.from({length: sc00.ch.length}, (_, i) =>({nodeId: genNodeId(i), path: [...getXS(m).path, 'c', 0, i] as PC} as N)))
  m.sort(sortPath)
}

export const insertSCCR = (m: M) => {
  const sc00 = getNodeById(m, getXS(m).co1.at(0) as string) as C
  m.push(...Array.from({length: sc00.cv.length}, (_, i) =>({nodeId: genNodeId(i), path: [...getXS(m).path, 'c', i, sc00.ch.length] as PC} as N)))
  m.sort(sortPath)
}

export const insertSCCL = (m: M) => {
  const ccIndex = getXS(m).path.length + 2
  const toMoveR = [...getXS(m).co1, ...getXS(m).co1.map(nid => getNodeById(m, nid) as C).flatMap(el => el.so)].map(nid => getNodeById(m, nid))
  toMoveR.forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  const sc00 = getNodeById(m, getXS(m).co1.at(0) as string) as C
  m.push(...Array.from({length: sc00.cv.length}, (_, i) =>({nodeId: genNodeId(i), path: [...getXS(m).path, 'c', i, 0] as PC} as N)))
  m.sort(sortPath)
}

export const insertTable = (m: M, insertParentNode: T, insertTargetIndex: number, payload: {rowLen: number, colLen: number}) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  mT(m).forEach(ti => isSEODO(ip, ti.path) && ti.path.splice(ip.length - 1, 1, ti.path.at(ip.length - 1) + 1))
  unselectNodes(m)
  m.push({selected: 1, nodeId: IS_TESTING ? 'xt_' : 'node' + genHash(8), path: ip} as N)
  m.push(...tableIndices.map((el, i) => ({nodeId: genNodeId(i), path: [...ip, 'c', ...el]} as N)))
  m.sort(sortPath)
}

const genNodeId = (i: number): string => IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8)
