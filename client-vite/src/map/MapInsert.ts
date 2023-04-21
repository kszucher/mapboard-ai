import {M, P} from "../state/MapPropTypes"
import {genHash, getTableIndices} from "../core/Utils"
import {selectNode} from "./MapSelect";
import {getCountCC, getCountCR, getDefaultNode, getInsertParentNode, getLS, incGtCD, incGtCR, incGteCD, incGteCR, incPi, incSDO, incSSODO, sortPath} from "./MapUtils"

const insertNode = (m: M, attributes: object) => {
  m.push(getDefaultNode({...attributes, nodeId: 'node' + genHash(8)}))
  m.sort(sortPath)
}

const insertNodeList = (m: M, pList: P[]) => {
  m.push(...pList.map(p => getDefaultNode({path: structuredClone(p), nodeId: 'node' + genHash(8)})))
  m.sort(sortPath)
}

const insertCellNodeList = (m: M, p: P, indices: number[][]) => {
  insertNodeList(m, indices.map(el => [...p, 'c', ...el]))
  insertNodeList(m, indices.map(el => [...p, 'c', ...el, 's', 0]))
}

export const insertSelectSO = (m: M, attributes: object) => {
  const insertPath = [...getInsertParentNode(m).path, 's', getInsertParentNode(m).sCount]
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus})
  selectNode(m, insertPath, 's')
}

export const insertSelectSD = (m: M, attributes: object) => {
  const insertPath = incPi(getLS(m).path, getLS(m).path.length - 1)
  incSDO(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

export const insertSelectSU = (m: M, attributes: object) => {
  const insertPath = getLS(m).path
  incSSODO(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

export const insertSelectTable = (m: M, r: number, c: number) => {
  insertSelectSO(m, {}) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path, getTableIndices(r, c))
}

export const insertCCR = (m: M) => {
  incGtCR(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCC(m, getLS(m).path)).fill(null).map((el, i) => [i, getLS(m).path.at(-1) + 1]))
}

export const insertCCL = (m: M) => {
  incGteCR(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCC(m, getLS(m).path)).fill(null).map((el, i) => [i, getLS(m).path.at(-1) - 1]))
}

export const insertCRD = (m: M) => {
  incGtCD(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCR(m, getLS(m).path)).fill(null).map((el, i) => [getLS(m).path.at(-2) + 1, i]))
}

export const insertCRU = (m: M) => {
  incGteCD(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCR(m, getLS(m).path)).fill(null).map((el, i) => [getLS(m).path.at(-2) - 1, i]))
}
