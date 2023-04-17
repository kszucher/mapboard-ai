import {M, P} from "../state/MapPropTypes"
import {genHash, get_cc_indices, get_cr_indices, get_table_indices} from "../core/Utils"
import {selectNode} from "./MapReducer"
import {
  get_CC_siblingCount,
  get_CR_siblingCount,
  getDefaultNode,
  getInsertParentNode,
  getLS,
  inc_gt_C_D,
  inc_gt_C_R,
  inc_gte_C_D,
  inc_gte_C_R,
  inc_pi,
  inc_S_D_O,
  inc_S_S_O_D_O,
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
  selectNode(m, insertPath, 's', false)
}

export const insert_select_S_U = (m: M, attributes: object) => {
  const insertPath = getLS(m).path
  inc_S_S_O_D_O(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's', false)
}

export const insert_select_S_D = (m: M, attributes: object) => {
  const insertPath = inc_pi(getLS(m).path, getLS(m).path.length - 1)
  inc_S_D_O(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's', false)
}

export const insert_select_table = (m: M, r: number, c: number) => {
  insert_select_S_O(m, {}) // note: getLS will be up-to-date in the next phase!!!
  insertCellNodeList(m, getLS(m).path, get_table_indices(r, c))
}

export const insert_CC_R = (m: M) => {
  inc_gt_C_R(m)
  const r = get_CR_siblingCount(m, getLS(m).path)
  const c = getLS(m).path.at(-1) as number + 1
  insertCellNodeList(m, getLS(m).path.slice(0, -3), get_cc_indices(r, c))
}

export const insert_CC_L = (m: M) => {
  inc_gte_C_R(m)
  const r = get_CR_siblingCount(m, getLS(m).path)
  const c = getLS(m).path.at(-1) as number
  insertCellNodeList(m, getLS(m).path.slice(0, -3), get_cc_indices(r, c))
}

export const insert_CR_U = (m: M) => {
  inc_gt_C_D(m)
  const r = getLS(m).path.at(-2) as number + 1
  const c = get_CC_siblingCount(m, getLS(m).path)
  insertCellNodeList(m, getLS(m).path.slice(0, -3), get_cr_indices(r, c))
}

export const insert_CR_D = (m: M) => {
  inc_gte_C_D(m)
  const r = getLS(m).path.at(-2) as number
  const c = get_CC_siblingCount(m, getLS(m).path)
  insertCellNodeList(m, getLS(m).path.slice(0, -3), get_cr_indices(r, c))
}
