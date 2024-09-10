import {C, LPartial, M, PS, L, R, S} from "../mapState/MapStateTypes.ts"
import {unselectNodes} from "./MapSelect"
import {getAXC, getFXS, getG, getLastIndexL, getLastIndexR, getLXS, getXC, getXR, getXS} from "../mapQueries/MapQueries.ts"

export const insertL = (m: M, lPartial: Omit<LPartial, 'nodeId' | 'path'>) => {
  m.push({path: ['l', getLastIndexL(m) + 1], ...lPartial} as L)
}

export const insertR = (m: M) => {
  const lastIndexR = getLastIndexR(m)
  unselectNodes(m)
  m.push({path: ['r', lastIndexR + 1], selected: 1, offsetW: getG(m).selfW, offsetH: getG(m).selfH} as R)
  m.push({path: ['r', lastIndexR + 1, 's', 0] as PS, content: 'New Root'} as S)
}

export const insertSD = (m: M, attributes?: object) => {
  const lxs = getLXS(m)
  lxs.sd.flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => ti.path[lxs.path.length - 1] += 1)
  unselectNodes(m)
  m.push({path: lxs.path.with(-1,lxs.path.at(-1) + 1), selected: 1, ...attributes} as S)
}

export const insertSU = (m: M, attributes?: object) => {
  const fxs = getFXS(m);
  [fxs, ...fxs.sd].flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => ti.path[fxs.path.length - 1] += 1)
  unselectNodes(m)
  m.push({path: fxs.path.with(-1, fxs.path.at(-1) - 1), selected: 1, ...attributes} as S)
}

export const insertRSO = (m: M) => {
  const xr = getXR(m)
  unselectNodes(m)
  m.push({path: [...xr.path, 's', xr.so1.length] as PS, selected: 1} as S)
}

export const insertSSO = (m: M, attributes?: object) => {
  const xs = getXS(m)
  unselectNodes(m)
  m.push({path: [...xs.path, 's', xs.so1.length] as PS, selected: 1, ...attributes} as S)
}

export const insertCSO = (m: M) => {
  const xc = getXC(m)
  unselectNodes(m)
  m.push({path: [...xc.path, 's', xc.so1.length] as PS, selected: 1} as S)
}

export const insertCRD = (m: M) => {
  getAXC(m).flatMap(ci => ci.cd).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXC(m).path.length - 2] += 1)
  m.push(...getAXC(m).map(ci => ci.path.with(-2, ci.path.at(-2) + 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertCRU = (m: M) => {
  getAXC(m).flatMap(ci => [ci, ...ci.cd]).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXC(m).path.length - 2] += 1)
  m.push(...getAXC(m).map(ci => ci.path.with(-2, ci.path.at(-2) - 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertCCR = (m: M) => {
  getAXC(m).flatMap(ci => ci.cr).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXC(m).path.length - 1] += 1)
  m.push(...getAXC(m).map(ci => ci.path.with(-1, ci.path.at(-1) + 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertCCL = (m: M) => {
  getAXC(m).flatMap(ci => [ci, ...ci.cr]).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXC(m).path.length - 1] += 1)
  m.push(...getAXC(m).map(ci => ci.path.with(-1, ci.path.at(-1) - 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertSCRD = (m: M) => {
  m.push(...getXS(m).co1.at(-1)!.ch.map(ci => ci.path.with(-2, ci.path.at(-2) + 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertSCRU = (m: M) => {
  getXS(m).co1.at(0)!.ch.flatMap(ci => [ci, ...ci.cd]).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXS(m).path.length + 1] += 1)
  m.push(...getXS(m).co1.at(0)!.ch.map(ci => ci.path.with( - 2, ci.path.at(-2) - 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertSCCR = (m: M) => {
  m.push(...getXS(m).co1.at(-1)!.cv.map(ci => ci.path.with(-1, ci.path.at(-1) + 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertSCCL = (m: M) => {
  getXS(m).co1.at(0)!.cv.flatMap(ci => [ci, ...ci.cr]).flatMap(ci => [ci, ...ci.so]).forEach(ci => ci.path[getXS(m).path.length + 2] += 1)
  m.push(...getXS(m).co1.at(0)!.cv.map(ci => ci.path.with( - 1, ci.path.at(-1) - 1)).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}

export const insertTable = (m: M, ip: PS, payload: {rowLen: number, colLen: number}) => {
  insertSSO(m)
  const { rowLen: r, colLen: c } = payload
  m.push(...Array.from({length: r*c}, (_, i) => ([...ip, 'c', Math.floor(i/c), i%c])).flatMap(p => [{path: p} as C, {path: p.concat('s', 0)} as S]))
}
