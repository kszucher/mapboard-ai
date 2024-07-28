import {C, LPartial, M, PC, PL, PR, PS} from "../state/MapStateTypes"
import {unselectNodes} from "./MapSelect"
import {getG, getLastIndexL, getLastIndexR, getXS, idToC, idToS, isXAS} from "../mapQueries/MapQueries.ts"
import {getTableIndices} from "../utils/Utils"
import {sSaveOptional} from "../state/MapState.ts"
import {sortPath} from "./MapSort.ts"
import {genNodeC, genNodeL, genNodeR, genNodeS} from "./PathGen.ts"
import {offsetSC} from "./MapOffset.ts"

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

export const insertS = (m: M, ip: PS, attributes?: object) => {
  offsetSC(m, ip, 1)
  const parentTaskStatus = isXAS(m) ? getXS(m).taskStatus : sSaveOptional.taskStatus
  unselectNodes(m)
  m.push(genNodeS(ip, {selected: 1, taskStatus: parentTaskStatus, ...attributes}))
  m.sort(sortPath)
}

export const insertCL = (m: M, index: number, newValue: number, insertBaseCL: C[], offsetBaseCL: C[]) => {
  offsetBaseCL.flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(index, 1, si.path.at(index) + 1))
  offsetBaseCL.map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(index, 1, ci.path.at(index) + 1))
  m.push(...insertBaseCL.map(ci => genNodeC(ci.path.with(index, newValue) as PC)))
  m.push(...insertBaseCL.map(ci => genNodeS([...ci.path.with(index, newValue), 's', 0] as PS)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  insertS(m, ip)
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  m.push(...tableIndices.map(el => genNodeC([...ip, 'c', ...el] as PC)))
  m.push(...tableIndices.map(el => genNodeS([...ip, 'c', ...el, 's', 0] as PS)))
  m.sort(sortPath)
}
