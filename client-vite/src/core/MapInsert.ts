import {GN, M, N, P} from "../state/MapStateTypes"
import {getInsertTemplate} from "./MapInsertTemplates"
import {unselectNodes} from "./MapSelect"
import {getCountSCC, getCountSCR, getNodeByPath, getSI1P, getXP, makeSpaceFromCC, makeSpaceFromCR, makeSpaceFromS, sortPath} from "./MapUtils"
import {generateCharacter, genHash, getTableIndices, IS_TESTING} from "./Utils"

export const insertTemplateR = (m: M, templateId: string, ri: number, offsetW: number, offsetH: number) => {
  unselectNodes(m)
  const template = getInsertTemplate(templateId, ri, offsetW, offsetH)
  m.push(...template)
  m.sort(sortPath)
}

export const insertS = (m: M, insertParentNode: N, insertTargetIndex: number, attributes: object) => {
  makeSpaceFromS(m, [...insertParentNode.path, 's', insertTargetIndex], 1)
  unselectNodes(m)
  m.push({
    selected: 1,
    selection: 's',
    nodeId: IS_TESTING ? 't' : 'node' + genHash(8),
    path: [...insertParentNode.path, 's', insertTargetIndex],
    taskStatus: getNodeByPath(m, getXP(m)).taskStatus,
    ...attributes
  } as GN)
  m.sort(sortPath)
}

export const insertCR = (m: M, ip: P) => {
  const rowIndices = Array(getCountSCC(m, getSI1P(ip))).fill(null).map((el, i) => [ip.at(-2), i])
  makeSpaceFromCR(m, ip)
  m.push(...rowIndices.map((el, i) => ({
    selected: 0,
    selection: 's',
    nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8),
    path: [...ip.slice(0, -3), 'c', ...el]
  }  as GN)))
  m.sort(sortPath)
}

export const insertCC = (m: M, ip: P) => {
  const colIndices = Array(getCountSCR(m, getSI1P(ip))).fill(null).map((el, i) => [i, ip.at(-1)])
  makeSpaceFromCC(m, ip)
  m.push(...colIndices.map((el, i) => ({
    selected: 0,
    selection: 's',
    nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8),
    path: [...ip.slice(0, -3), 'c', ...el]
  } as GN)))
  m.sort(sortPath)
}

export const insertTable = (m: M, insertParentNode: N, insertTargetIndex: number, payload: {rowLen: number, colLen: number}) => {
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  makeSpaceFromS(m, [...insertParentNode.path, 's', insertTargetIndex], 1)
  unselectNodes(m)
  m.push({
    selected: 1,
    selection: 's',
    nodeId: IS_TESTING ? 't' : 'node' + genHash(8),
    path: [...insertParentNode.path, 's', insertTargetIndex]
  } as GN)
  m.push(...tableIndices.map((el, i) => ({
    selected: 0,
    selection: 's',
    nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8),
    path: [...insertParentNode.path, 's', insertTargetIndex, 'c', ...el]
  } as GN)))
  m.sort(sortPath)
}
