import {M, LPartial, RPartial, SPartial, CPartial, L, R, S, C, PL, PR, PS, PC} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getLastIndexL, mS, mC, getLastIndexR, getG, getXS, isXAS, getXAC, getXC, idToC, idToS} from "../mapQueries/MapQueries.ts"
import {genNodeId, getTableIndices, IS_TESTING} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"
import {sortPath} from "./MapSort.ts"
import {isCEODO, isSEODO} from "../mapQueries/PathQueries.ts";

const genNodeL = (el: PL, attributes?: Omit<LPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as L)
const genNodeR = (el: PR, attributes?: Omit<RPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as R)
const genNodeS = (el: PS, attributes?: Omit<SPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as S)
const genNodeC = (el: PC, attributes?: Omit<CPartial, 'path' | 'nodeId'>) => ({nodeId: IS_TESTING ? '_' + el.join('') : genNodeId(), path: el, ...attributes} as C)

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

export const insertCRD = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const cd = getXAC(m).flatMap(ci => ci.cd).map(nid => idToC(m, nid))
  cd.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  cd.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  m.push(...getXAC(m).map(ci => genNodeC(ci.path.with(crIndex, crValue + 1) as PC)))
  m.push(...getXAC(m).map(ci => genNodeS([...ci.path.with(crIndex, crValue + 1), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertCRU = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const ced = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cd]).map(nid => idToC(m, nid))
  ced.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  ced.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  m.push(...getXAC(m).map(ci => genNodeC(ci.path.with(crIndex, crValue) as PC)))
  m.push(...getXAC(m).map(ci => genNodeS([...ci.path.with(crIndex, crValue), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertCCR = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const cr = getXAC(m).flatMap(ci => ci.cr).map(nid => idToC(m, nid))
  cr.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  cr.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map(ci => genNodeC(ci.path.with(ccIndex, ccValue + 1) as PC)))
  m.push(...getXAC(m).map(ci => genNodeS([...ci.path.with(ccIndex, ccValue + 1), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertCCL = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const cer = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cr]).map(nid => idToC(m, nid))
  cer.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  cer.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map(ci => genNodeC(ci.path.with(ccIndex, ccValue) as PC)))
  m.push(...getXAC(m).map(ci => genNodeS([...ci.path.with(ccIndex, ccValue), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertSCRD = (m: M) => {
  const colIndices = Array.from({length: getXS(m).colCount}, (_, i) => i)
  m.push(...colIndices.map(i => genNodeC([...getXS(m).path, 'c', getXS(m).rowCount, i] as PC)))
  m.push(...colIndices.map(i => genNodeS([...getXS(m).path, 'c', getXS(m).rowCount, i, 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertSCRU = (m: M) => {
  const crIndex = getXS(m).path.length + 1
  const colIndices = Array.from({length: getXS(m).colCount}, (_, i) => i)
  getXS(m).co1.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  getXS(m).co1.map(nid => idToC(m, nid)).flatMap(el => el.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  m.push(...colIndices.map(i => genNodeC([...getXS(m).path, 'c', 0, i] as PC)))
  m.push(...colIndices.map(i => genNodeS([...getXS(m).path, 'c', 0, i, 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertSCCR = (m: M) => {
  const rowIndices = Array.from({length: getXS(m).rowCount}, (_, i) => i)
  m.push(...rowIndices.map(i => genNodeC([...getXS(m).path, 'c', i, getXS(m).colCount] as PC)))
  m.push(...rowIndices.map(i => genNodeS([...getXS(m).path, 'c', i, getXS(m).colCount, 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertSCCL = (m: M) => {
  const ccIndex = getXS(m).path.length + 2
  const rowIndices = Array.from({length: getXS(m).rowCount}, (_, i) => i)
  getXS(m).co1.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  getXS(m).co1.map(nid => idToC(m, nid)).flatMap(el => el.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  m.push(...rowIndices.map(i => genNodeC([...getXS(m).path, 'c', i, 0] as PC)))
  m.push(...rowIndices.map(i => genNodeS([...getXS(m).path, 'c', i, 0, 's', 0] as PS)))
  m.sort(sortPath)
}

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
