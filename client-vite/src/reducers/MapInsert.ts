import {M, LPartial, RPartial, SPartial, CPartial, PS, PC} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {sortPath, isSEODO, getLastIndexL, mS, mC, getLastIndexR, getG, getXS, isXAS, getXAC, getXC, idToC, idToS, isCEODO} from "../queries/MapQueries.ts"
import {genNodeId, getTableIndices, IS_TESTING} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"

export const insertL = (m: M, lPartial: LPartial) => {
  m.push(...[{
    ...lPartial,
    nodeId: IS_TESTING ? 't' : genNodeId(),
    path: ['l', getLastIndexL(m) + 1]
  } as LPartial] as M)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push(...[
    {
      nodeId: IS_TESTING ? 't' : genNodeId(),
      path: ['r', lastIndexR + 1],
      selected: 1,
      offsetW: getG(m).selfW,
      offsetH: getG(m).selfH
    } as RPartial,
    {
      nodeId: IS_TESTING ? 'u' : genNodeId(),
      path: ['r', lastIndexR + 1, 's', 0],
      content: 'New Root'
    } as SPartial
  ] as M)
  m.sort(sortPath)
}

export const insertS = (m: M, ip: PS, attributes: object) => {
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + 1))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + 1))
  const parentTaskStatus = isXAS(m) ? getXS(m).taskStatus : sSaveOptional.taskStatus
  unselectNodes(m)
  m.push(...[{
    selected: 1,
    nodeId: IS_TESTING ? '_' + ip.join('') : genNodeId(),
    path: ip, taskStatus: parentTaskStatus,
    ...attributes
  } as SPartial] as M)
  m.sort(sortPath)
}

export const insertCRD = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const cd = getXAC(m).flatMap(ci => ci.cd).map(nid => idToC(m, nid))
  cd.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  cd.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  m.push(...getXAC(m).map(ci => ({
    nodeId: IS_TESTING ? '_' + ci.path.with(crIndex, crValue + 1).join('') : genNodeId(),
    path: ci.path.with(crIndex, crValue + 1)
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertCRU = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  const crValue = getXC(m).path.at(crIndex)
  const ced = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cd]).map(nid => idToC(m, nid))
  ced.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  ced.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  m.push(...getXAC(m).map(ci => ({
    nodeId: IS_TESTING ? '_' + ci.path.with(crIndex, crValue).join('') : genNodeId(),
    path: ci.path.with(crIndex, crValue)
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertCCR = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const cr = getXAC(m).flatMap(ci => ci.cr).map(nid => idToC(m, nid))
  cr.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  cr.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map(ci => ({
    nodeId: IS_TESTING ? '_' + ci.path.with(ccIndex, ccValue + 1).join('') : genNodeId(),
    path: ci.path.with(ccIndex, ccValue + 1)
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertCCL = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  const ccValue = getXC(m).path.at(ccIndex)
  const cer = getXAC(m).flatMap(ci => [ci.nodeId, ...ci.cr]).map(nid => idToC(m, nid))
  cer.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  cer.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  m.push(...getXAC(m).map(ci => ({
    nodeId: IS_TESTING ? '_' + ci.path.with(ccIndex, ccValue).join('') : genNodeId(),
    path: ci.path.with(ccIndex, ccValue)
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertSCRD = (m: M) => {
  m.push(...Array.from({length: getXS(m).colCount}, (_, i) =>({
    nodeId: IS_TESTING ? '_' + [...getXS(m).path, 'c', getXS(m).rowCount, i].join('') : genNodeId(),
    path: [...getXS(m).path, 'c', getXS(m).rowCount, i] as PC
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertSCRU = (m: M) => {
  const crIndex = getXS(m).path.length + 1
  getXS(m).co1.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  getXS(m).co1.map(nid => idToC(m, nid)).flatMap(el => el.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  m.push(...Array.from({length: getXS(m).colCount}, (_, i) =>({
    nodeId: IS_TESTING ? '_' + [...getXS(m).path, 'c', 0, i].join('') : genNodeId(),
    path: [...getXS(m).path, 'c', 0, i] as PC
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertSCCR = (m: M) => {
  m.push(...Array.from({length: getXS(m).rowCount}, (_, i) =>({
    nodeId: IS_TESTING ? '_' + [...getXS(m).path, 'c', i, getXS(m).colCount].join('') : genNodeId(),
    path: [...getXS(m).path, 'c', i, getXS(m).colCount] as PC
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertSCCL = (m: M) => {
  const ccIndex = getXS(m).path.length + 2
  getXS(m).co1.map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  getXS(m).co1.map(nid => idToC(m, nid)).flatMap(el => el.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  m.push(...Array.from({length: getXS(m).rowCount}, (_, i) =>({
    nodeId: IS_TESTING ? '_' + [...getXS(m).path, 'c', i, 0].join('') : genNodeId(),
    path: [...getXS(m).path, 'c', i, 0] as PC
  } as CPartial)) as M)
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + 1))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + 1))
  unselectNodes(m)
  m.push(...[
    {selected: 1, nodeId: IS_TESTING ? '_' + ip.join('') : genNodeId(), path: ip} as SPartial,
    ...tableIndices.map(el => ({nodeId: IS_TESTING ? '_' + [...ip, 'c', ...el].join('') : genNodeId(), path: [...ip, 'c', ...el]} as CPartial)),
    ...tableIndices.map(el => ({nodeId: IS_TESTING ? '_' + [...ip, 'c', ...el, 's', 0].join('') : genNodeId(), path: [...ip, 'c', ...el, 's', 0]} as SPartial)),
  ] as M)
  m.sort(sortPath)
}
