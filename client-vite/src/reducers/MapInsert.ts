import {GN, M, N, P} from "../state/MapStateTypes"
import {getInsertTemplate} from "./MapInsertTemplates"
import {unselectNodes} from "./MapSelect"
import {getCountNSCV, getCountNSCH, getX, sortPath, isCED, isCER, isSEODO} from "../selectors/MapSelector"
import {generateCharacter, genHash, getTableIndices, IS_TESTING} from "../utils/Utils"

export const insertTemplateR = (m: M, templateId: string, ri: number, offsetW: number, offsetH: number) => {
  unselectNodes(m)
  const template = getInsertTemplate(templateId, ri, offsetW, offsetH)
  m.push(...template)
  m.sort(sortPath)
}

export const insertR = (m: M) => {

}

export const insertS = (m: M, insertParentNode: N, insertTargetIndex: number, attributes: object) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + 1))
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip, taskStatus: getX(m).taskStatus, ...attributes} as GN)
  m.sort(sortPath)
}

export const insertCR = (m: M, insertParentNode: N, insertTargetRowIndex: number) => {
  const ipList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  m.forEach(n => ipList.map(ip => isCED(ip, n.path) && n.path.splice(ip.length - 2, 1, n.path.at(ip.length - 2) as number + 1)))
  m.push(...ipList.map((p, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: p}  as GN)))
  m.sort(sortPath)
}

export const insertCC = (m: M, insertParentNode: N, insertTargetColumnIndex: number) => {
  const ipList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  m.forEach(n => ipList.map(ip => isCER(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + 1)))
  m.push(...ipList.map((p, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: p} as GN)))
  m.sort(sortPath)
}

export const insertTable = (m: M, insertParentNode: N, insertTargetIndex: number, payload: {rowLen: number, colLen: number}) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + 1))
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip} as GN)
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip, 'c', ...el]} as GN)))
  m.sort(sortPath)
}
