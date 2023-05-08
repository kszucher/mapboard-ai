import {GN, M, P} from "../state/MapPropTypes"
import {genHash, getTableIndices, IS_TESTING} from "../core/Utils"
import {selectNode} from "./MapSelect";
import {
  getCountCV,
  getCountCH,
  getCountCXU,
  getCountCXL,
  getDefaultNode,
  getXP,
  incXCDF,
  incXCRF,
  incXCFDF,
  incXCFRF,
  sortPath,
  makeSpaceFromS,
  getSXI1,
  getNodeByPath,
  getSXUI,
  getX
} from "./MapUtils"

const insertNode = (m: M, ip: P, attributes: object) => { // if I return ip, this can be used in one-liners...
  makeSpaceFromS(m, ip, 1)
  m.push({nodeId: IS_TESTING ? 'z' : 'node' + genHash(8), ...attributes} as GN)
  m.sort(sortPath)
}

export const insertNodeList = (m: M, pList: P[]) => {
  m.push(...pList.map((p, i) => getDefaultNode({path: structuredClone(p), nodeId: IS_TESTING ? 'z' + i : 'node' + genHash(8)}))) // TODO remove default
  m.sort(sortPath)
}

const insertCellNodeList = (m: M, p: P, indices: number[][]) => {
  insertNodeList(m, indices.map(el => [...p, 'c', ...el]))
  insertNodeList(m, indices.map(el => [...p, 'c', ...el, 's', 0]))
}

export const insertSD = (m: M, ip: P, attributes: object) => {
  insertNode(m, ip, {...attributes, path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus})
  selectNode(m, ip, 's')
}

export const insertSU = (m: M, ip: P, attributes: object) => {
  insertNode(m, ip, {...attributes, path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus})
  selectNode(m, ip, 's')
}

export const insertSO = (m: M, ip: P, attributes: object) => {
  insertNode(m, ip, {...attributes, path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus})
  selectNode(m, ip, 's')
}

export const insertSOR = (m: M, ip: P, attributes: object) => {
  insertNode(m, ip, {...attributes, path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus})
  selectNode(m, ip, 's')
}

export const insertTable = (m: M, ip: P, r: number, c: number) => {
  insertSO(m, ip, {})
  insertCellNodeList(m, getXP(m), getTableIndices(r, c))
}

export const insertCRD = (m: M) => {
  incXCDF(m)
  insertCellNodeList(m, getXP(m).slice(0, -3), Array(getCountCH(m, getXP(m))).fill(null).map((el, i) => [getCountCXU(m) + 1, i]))
}

export const insertCRU = (m: M) => {
  incXCFDF(m)
  insertCellNodeList(m, getXP(m).slice(0, -3), Array(getCountCH(m, getXP(m))).fill(null).map((el, i) => [getCountCXU(m) - 1, i]))
}

export const insertCCR = (m: M) => {
  incXCRF(m)
  insertCellNodeList(m, getXP(m).slice(0, -3), Array(getCountCV(m, getXP(m))).fill(null).map((el, i) => [i, getCountCXL(m) + 1]))
}

export const insertCCL = (m: M) => {
  incXCFRF(m)
  insertCellNodeList(m, getXP(m).slice(0, -3), Array(getCountCV(m, getXP(m))).fill(null).map((el, i) => [i, getCountCXL(m) - 1]))
}
