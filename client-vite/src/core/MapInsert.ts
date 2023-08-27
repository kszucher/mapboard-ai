import {GN, M, P} from "../state/MapStateTypes"
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

export const insertS = (m: M, ip: P, attributes: object) => {
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus, ...attributes} as GN)
  m.sort(sortPath)
}

export const insertCR = (m: M, ip: P) => {
  const rowIndices = Array(getCountSCC(m, getSI1P(ip))).fill(null).map((el, i) => [ip.at(-2), i])
  makeSpaceFromCR(m, ip)
  m.push(...rowIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.sort(sortPath)
}

export const insertCC = (m: M, ip: P) => {
  const colIndices = Array(getCountSCR(m, getSI1P(ip))).fill(null).map((el, i) => [i, ip.at(-1)])
  makeSpaceFromCC(m, ip)
  m.push(...colIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: P, payload: {rowLen: number, colLen: number}) => {
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip} as GN)
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip, 'c', ...el]}  as GN)))
  m.sort(sortPath)
}
