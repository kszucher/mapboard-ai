import {tSaveOptional} from "../state/MapState"
import {N, LPartial, M, T, PT} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getCountTSCV, getCountTSCH, getX, sortPath, isSEODO, getLastIndexL, mT, getLastIndexR, getG} from "../selectors/MapSelector"
import {generateCharacterFrom, genHash, getTableIndices, IS_TESTING} from "../utils/Utils"
import {makeSpaceFromCc, makeSpaceFromCr, makeSpaceFromS} from "./MapSpace"

export const insertL = (m: M, lPartial: LPartial) => {
  m.push({...lPartial, nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ['l', getLastIndexL(m) + 1]} as N)
}

export const insertR = (m: M) => {
  const newRoot = [
    {nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ['r', getLastIndexR(m) + 1], selected: 1, content: 'New Root'},
  ] as T[]
  newRoot.forEach(ti => Object.assign(ti, {
    offsetW: ti.selected ? (ti.offsetW ? ti.offsetW : tSaveOptional.offsetW) + getG(m).mapWidth : ti.offsetW,
    offsetH: ti.selected ? (ti.offsetH ? ti.offsetH : tSaveOptional.offsetH) + getG(m).mapHeight : ti.offsetH,
  }))
  unselectNodes(m)
  m.push(...newRoot)
  m.sort(sortPath)
}

export const insertS = (m: M, insertParentNode: T, insertTargetIndex: number, attributes: object) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 'xt_' : 'node' + genHash(8), path: ip, taskStatus: getX(m).taskStatus, ...attributes} as N)
  m.sort(sortPath)
}

export const insertCR = (m: M, insertParentNode: T, insertTargetRowIndex: number) => {
  const ipList = Array(getCountTSCH(m, insertParentNode)).fill(null).map((_, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as PT)
  makeSpaceFromCr(m, ipList, 1)
  m.push(...ipList.map((p, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8), path: p}  as N)))
  m.sort(sortPath)
}

export const insertCC = (m: M, insertParentNode: T, insertTargetColumnIndex: number) => {
  const ipList = Array(getCountTSCV(m, insertParentNode)).fill(null).map((_, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as PT)
  makeSpaceFromCc(m, ipList, 1)
  m.push(...ipList.map((p, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8), path: p} as N)))
  m.sort(sortPath)
}

export const insertTable = (m: M, insertParentNode: T, insertTargetIndex: number, payload: {rowLen: number, colLen: number}) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  mT(m).forEach(ti => isSEODO(ip, ti.path) && ti.path.splice(ip.length - 1, 1, ti.path.at(ip.length - 1) + 1))
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 'xt_' : 'node' + genHash(8), path: ip} as N)
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8), path: [...ip, 'c', ...el]} as N)))
  m.sort(sortPath)
}
