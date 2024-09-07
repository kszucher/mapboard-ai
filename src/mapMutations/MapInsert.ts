import {C, LPartial, M, PS, L, R, S, PC} from "../mapState/MapStateTypes.ts"
import {unselectNodes} from "./MapSelect"
import {getG, getLastIndexL, getLastIndexR} from "../mapQueries/MapQueries.ts"
import {sortPath} from "./MapSort.ts"

export const insertL = (m: M, lPartial: Omit<LPartial, 'nodeId' | 'path'>) => {
  m.push({path: ['l', getLastIndexL(m) + 1], ...lPartial} as L)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push({path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH} as R)
  m.push({path: ['r', lastIndexR + 1, 's', 0] as PS, content: 'New Root'} as S)
  m.sort(sortPath)
}

export const insertS = (m: M, offsetBaseS: S | null, ip: PS, attributes?: object) => {
  if (offsetBaseS) [offsetBaseS, ...offsetBaseS.sd].flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => ti.path[ip.length - 1] += 1)
  unselectNodes(m)
  m.push({path: ip, selected: 1, ...attributes} as S)
  m.sort(sortPath)
}

export const insertCL = (m: M, offsetBaseCL: C[] | null,  offsetIndex: number, ipl: PC[]) => {
  if (offsetBaseCL) offsetBaseCL.flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[offsetIndex] += 1)
  m.push(...ipl.map(ip => ({path: ip} as C)))
  m.push(...ipl.map(ip => ({path: [...ip, 's', 0] as PS} as S)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  insertS(m, null, ip)
  const { rowLen: r, colLen: c } = payload
  const cellIndices = Array.from({length: r*c}, (_, i) => ([Math.floor(i/c), i%c]))
  m.push(...cellIndices.map(el => ({path: [...ip, 'c', ...el]} as C)))
  m.push(...cellIndices.map(el => ({path: [...ip, 'c', ...el, 's', 0]} as S)))
  m.sort(sortPath)
}
