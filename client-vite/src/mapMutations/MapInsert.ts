import {C, LPartial, M, PC, PL, PR, PS} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getFirstXSCC, getFirstXSCR, getG, getLastIndexL, getLastIndexR, getLastXSCC, getLastXSCR, getXAC, getXC, getXS, idToC, idToS, isXAS, mC, mS} from "../mapQueries/MapQueries.ts"
import {getTableIndices} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"
import {sortPath} from "./MapSort.ts"
import {isCEODO, isSEODO} from "../mapQueries/PathQueries.ts"
import {genNodeC, genNodeL, genNodeR, genNodeS} from "./PathGen.ts"

export const insertL = (m: M, lPartial: LPartial) => {
  m.push(genNodeL(['l', getLastIndexL(m) + 1] as PL, {...lPartial}))
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push(genNodeR(['r', lastIndexR + 1] as PR, {selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH}))
  m.push(genNodeS(['r', lastIndexR + 1, 's', 0] as PS, {content: 'New Root'}))
  m.sort(sortPath)
}

export const insertS = (m: M, ip: PS, attributes: object) => {
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + 1))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + 1))
  const parentTaskStatus = isXAS(m) ? getXS(m).taskStatus : sSaveOptional.taskStatus
  unselectNodes(m)
  m.push(genNodeS(ip, {selected: 1, taskStatus: parentTaskStatus, ...attributes}))
  m.sort(sortPath)
}

const insertCL = (m: M, index: number, newValue: number, insertBaseCL: C[], offsetBaseCL: C[]) => {
  offsetBaseCL.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(index, 1, si.path.at(index) + 1))
  offsetBaseCL.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(index, 1, ci.path.at(index) + 1))
  m.push(...insertBaseCL.map(ci => genNodeC(ci.path.with(index, newValue) as PC)))
  m.push(...insertBaseCL.map(ci => genNodeS([...ci.path.with(index, newValue), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertCRD = (m: M) => insertCL(m, getXC(m).path.length - 2, getXC(m).path.at(-2) + 1, getXAC(m), getXAC(m).flatMap(ci => ci.cd).map(nid => idToC(m, nid)))
export const insertCRU = (m: M) => insertCL(m, getXC(m).path.length - 2, getXC(m).path.at(-2), getXAC(m), getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cd]).map(nid => idToC(m, nid)))
export const insertCCR = (m: M) => insertCL(m, getXC(m).path.length - 1, getXC(m).path.at(-1) + 1, getXAC(m), getXAC(m).flatMap(ci => ci.cr).map(nid => idToC(m, nid)))
export const insertCCL = (m: M) => insertCL(m, getXC(m).path.length - 1, getXC(m).path.at(-1), getXAC(m), getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cr]).map(nid => idToC(m, nid)))

export const insertSCRD = (m: M) => insertCL(m, getXS(m).path.length + 1, getXS(m).rowCount, getLastXSCR(m), [])
export const insertSCRU = (m: M) => insertCL(m, getXS(m).path.length + 1, 0, getFirstXSCR(m), getFirstXSCR(m).flatMap(ci => [ci.nodeId, ...ci.cd]).map(nid => idToC(m, nid)))
export const insertSCCR = (m: M) => insertCL(m, getXS(m).path.length + 2, getXS(m).colCount, getLastXSCC(m), [])
export const insertSCCL = (m: M) => insertCL(m, getXS(m).path.length + 2, 0, getFirstXSCC(m), getFirstXSCC(m).flatMap(ci => [ci.nodeId, ...ci.cr]).map(nid => idToC(m, nid)))

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + 1))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + 1))
  unselectNodes(m)
  m.push(genNodeS(ip, {selected: 1}))
  m.push(...tableIndices.map(el => genNodeC([...ip, 'c', ...el] as PC)))
  m.push(...tableIndices.map(el => genNodeS([...ip, 'c', ...el, 's', 0] as PS)))
  m.sort(sortPath)
}
