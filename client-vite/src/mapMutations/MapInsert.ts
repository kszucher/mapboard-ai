import {C, LPartial, M, PS, L, R, S} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getG, getLastIndexL, getLastIndexR, getXS, idToS, isXAS} from "../mapQueries/MapQueries.ts"
import {genNodeId, getTableIndices} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"
import {sortPath} from "./MapSort.ts"
import {offsetSC} from "./MapOffset.ts"

export const insertL = (m: M, lPartial: Omit<LPartial, 'nodeId' | 'path'>) => {
  m.push({nodeId: genNodeId(), path: ['l', getLastIndexL(m) + 1], ...lPartial} as L)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push({nodeId: genNodeId(), path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH} as R)
  m.push({nodeId: genNodeId(), path: ['r', lastIndexR + 1, 's', 0] as PS, content: 'New Root'} as S)
  m.sort(sortPath)
}

export const insertS = (m: M, ip: PS, attributes?: object) => {
  offsetSC(m, ip, 1)
  const parentTaskStatus = isXAS(m) ? getXS(m).taskStatus : sSaveOptional.taskStatus
  unselectNodes(m)
  m.push({nodeId: genNodeId(), path: ip, selected: 1, taskStatus: parentTaskStatus, ...attributes} as S)
  m.sort(sortPath)
}

export const insertCL = (m: M, index: number, newValue: number, insertBaseCL: C[], offsetBaseCL: C[]) => {
  offsetBaseCL.forEach(ci => ci.path.splice(index, 1, ci.path.at(index) + 1))
  offsetBaseCL.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(index, 1, si.path.at(index) + 1))
  m.push(...insertBaseCL.map(ci => ({nodeId: genNodeId(), path: ci.path.with(index, newValue)} as C)))
  m.push(...insertBaseCL.map(ci => ({nodeId: genNodeId(), path: [...ci.path.with(index, newValue), 's', 0]} as S)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  insertS(m, ip)
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  m.push(...tableIndices.map(el => ({nodeId: genNodeId(), path: [...ip, 'c', ...el]} as C)))
  m.push(...tableIndices.map(el => ({nodeId: genNodeId(), path: [...ip, 'c', ...el, 's', 0]} as S)))
  m.sort(sortPath)
}
