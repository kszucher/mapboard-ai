import {M, P} from "../state/MapPropTypes"
import {genHash, get_table_indices} from "../core/Utils"
import {selectNode} from "./MapReducer"
import {
  getCountCC,
  getCountCR,
  getDefaultNode,
  getInsertParentNode,
  getLS,
  incGtCD,
  incGtCR,
  incGteCD,
  incGteCR,
  inc_pi,
  incSDO,
  incSSODO,
  sortPath
} from "./MapUtils"

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

export const insert_select_S_O = (m: M, attributes: object) => {
  const insertPath = [...getInsertParentNode(m).path, 's', getInsertParentNode(m).sCount]
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus})
  selectNode(m, insertPath, 's')
}

export const insert_select_S_D = (m: M, attributes: object) => {
  const insertPath = inc_pi(getLS(m).path, getLS(m).path.length - 1)
  incSDO(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

export const insert_select_S_U = (m: M, attributes: object) => {
  const insertPath = getLS(m).path
  incSSODO(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

export const insert_select_table = (m: M, r: number, c: number) => {
  insert_select_S_O(m, {}) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path, get_table_indices(r, c))
}

export const insert_CC_R = (m: M) => {
  incGtCR(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCC(m, getLS(m).path)).fill(null).map((el, i) => [i, getLS(m).path.at(-1) + 1]))
}

export const insert_CC_L = (m: M) => {
  incGteCR(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCC(m, getLS(m).path)).fill(null).map((el, i) => [i, getLS(m).path.at(-1) - 1]))
}

export const insert_CR_D = (m: M) => {
  incGtCD(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCR(m, getLS(m).path)).fill(null).map((el, i) => [getLS(m).path.at(-2) + 1, i]))
}

export const insert_CR_U = (m: M) => {
  incGteCD(m) // warning: getLS changes in the next phase
  insertCellNodeList(m, getLS(m).path.slice(0, -3), Array(getCountCR(m, getLS(m).path)).fill(null).map((el, i) => [getLS(m).path.at(-2) - 1, i]))
}
