import {M, P} from "../state/MapPropTypes"
import {genHash, getTableIndices} from "../core/Utils"
import {selectNode} from "./MapSelect";
import {
  getCountCV,
  getCountCH,
  getCountCXU,
  getCountCXL,
  getDefaultNode,
  getInsertParentNode,
  getXP,
  incXCDF,
  incXCRF,
  incXCFDF,
  incXCFRF,
  incPi,
  incXSDF,
  incXSFDF,
  sortPath
} from "./MapUtils"

const insertNode = (m: M, attributes: object) => {
  m.push(getDefaultNode({...attributes, nodeId: 'node' + genHash(8)}))
  m.sort(sortPath)
}

export const insertNodeList = (m: M, pList: P[]) => {
  m.push(...pList.map(p => getDefaultNode({path: structuredClone(p), nodeId: 'node' + genHash(8)})))
  m.sort(sortPath)
}

const insertCellNodeList = (m: M, p: P, indices: number[][]) => {
  insertNodeList(m, indices.map(el => [...p, 'c', ...el]))
  // FIXME probably we do not NEED to have s by default here, so there will be no need for fix, and paste will be SOLVED too --> creation when START EDIT
  insertNodeList(m, indices.map(el => [...p, 'c', ...el, 's', 0]))
}

export const insertSD = (m: M, attributes: object) => {
  const insertPath = incPi(getXP(m), getXP(m).length - 1)
  incXSDF(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

export const insertSU = (m: M, attributes: object) => {
  const insertPath = getXP(m)
  incXSFDF(m)
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus > 0 ? 1 : 0})
  selectNode(m, insertPath, 's')
}

// FIXME insertSelectSOR, insertSelectSOL, insertSelectSO
export const insertSO = (m: M, attributes: object) => {
  const insertPath = [...getInsertParentNode(m).path, 's', getInsertParentNode(m).sCount] as P
  insertNode(m, {...attributes, path: insertPath, taskStatus: getInsertParentNode(m).taskStatus})
  selectNode(m, insertPath, 's')
}

export const insertTable = (m: M, r: number, c: number) => {
  insertSO(m, {})
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
