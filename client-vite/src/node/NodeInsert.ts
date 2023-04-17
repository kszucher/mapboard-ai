import {M, P} from "../state/MapPropTypes"
import {genHash, get_cc_indices, get_table_indices} from "../core/Utils"
import {selectNode} from "../map/MapReducer"
import {
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
} from "../map/MapUtils"

const insertNode = (m, attributes: object) => {
  m.push(getDefaultNode({...attributes, nodeId: 'node' + genHash(8)}))
  m.sort(sortPath)
}

const insertNodeList = (m, pList: P[]) => {
  m.push(...pList.map(p => getDefaultNode({path: structuredClone(p), nodeId: 'node' + genHash(8)})))
  m.sort(sortPath)
}

export const insertSelectNodeO = (m: M, attributes: object) => {
  const insertPath = [...getInsertParentNode(m).path, 's', getInsertParentNode(m).sCount]
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus})
  selectNode(m, insertPath, 's', false)
}

export const insertSelectNodeU = (m: M, attributes: object) => {
  const insertPath = getLS(m).path
  inc_S_S_O_D_O(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's', false)
}

export const insertSelectNodeD = (m: M, attributes: object) => {
  const insertPath = inc_pi(getLS(m).path, getLS(m).path.length - 1)
  inc_S_D_O(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's', false)
}

export const insertSelectTable = (m: M, r: number, c: number) => {
  insertSelectNodeO(m, {}) // note: getLS will be up-to-date in the next phase!!!
  insertNodeList(m, get_table_indices(r, c).map(el => [...getLS(m).path, 'c', ...el]))
  insertNodeList(m, get_table_indices(r, c).map(el => [...getLS(m).path, 'c', ...el, 's', 0]))
}

export const insert_CC_R = (m: M) => {
  inc_gt_C_R(m)
  const r = get_CR_siblingCount(m, getLS(m).path)
  const c = getLS(m).path.at(-1) + 1
  const cc_indices = get_cc_indices(r, c)
  insertNodeList(m, cc_indices.map(el => [...getLS(m).path.slice(0, -2), ...el]))
  insertNodeList(m, cc_indices.map(el => [...getLS(m).path.slice(0, -2), ...el, 's', 0]))
}

export const insert_CC_L = (m: M) => {
  inc_gte_C_R(m)
}

export const insert_CR_U = (m: M) => {
  inc_gt_C_D(m)
}

export const insert_CR_D = (m: M) => {
  inc_gte_C_D(m)
}
