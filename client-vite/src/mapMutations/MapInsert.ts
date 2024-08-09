import {C, LPartial, M, PS, L, R, S, PC} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getG, getLastIndexL, getLastIndexR} from "../mapQueries/MapQueries.ts"
import {genNodeId, getTableIndices} from "../utils/Utils"
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
  unselectNodes(m)
  m.push({nodeId: genNodeId(), path: ip, selected: 1, ...attributes} as S)
  m.sort(sortPath)
}

export const insertCL = (m: M, offsetIndex: number, ipl: PC[], offsetBaseCL: C[]) => {
  offsetBaseCL.forEach(ci => ci.path[offsetIndex] +=  1)
  offsetBaseCL.flatMap(ci => ci.so).forEach(si => si.path[offsetIndex] += 1)
  m.push(...ipl.map(ip => ({nodeId: genNodeId(), path: ip} as C)))
  m.push(...ipl.map(ip => ({nodeId: genNodeId(), path: [...ip, 's', 0] as PS} as S)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  insertS(m, ip)
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  m.push(...tableIndices.map(el => ({nodeId: genNodeId(), path: [...ip, 'c', ...el]} as C)))
  m.push(...tableIndices.map(el => ({nodeId: genNodeId(), path: [...ip, 'c', ...el, 's', 0]} as S)))
  m.sort(sortPath)
}
