import {getG, getLastIndexL, getLastIndexR, getXAS, getXLS, getXS, mC, mL, mR, mS} from "../mapQueries/MapQueries.ts"
import {rSaveOptional} from "../state/MapState"
import {C, L, M, PC, PS, R, S} from "../state/MapStateTypes"
import {genId} from "../utils/Utils"
import {deleteS} from "./MapDelete"
import {mapDeInit} from "./MapDeInit"
import {unselectNodes} from "./MapSelect"
import {sortPath} from "./MapSort.ts"
import {lToClipboard, rcToClipboard, rrToClipboard, rsToClipboard, scToClipboard, ssToClipboard} from "../mapQueries/MapExtract.ts"
import {offsetSC} from "./MapOffset.ts"

const formatCb = (arr: any[]) => "[\n" + arr.map((e: any) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

const cbSave = (cb: any) => {
  navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard
        .writeText(formatCb(cb))
        .then(() => {
          console.log('moved to clipboard')
        })
        .catch(err => {
          console.error('move to clipboard error: ', err)
        })
    }
  })
}

const clipboardToLRSC = (m: M, cbL: L[], cbRR: R[], cbRS: S[], cbRC: C[]) => {
  const lastIndexL = getLastIndexL(m)
  const lastIndexR = getLastIndexR(m)
  const nodeIdMappingR = new Map<string, string>(cbRR.map(ri => [ri.nodeId, genId()]))
  const nodeIdMappingRIterator = nodeIdMappingR[Symbol.iterator]()
  cbL.forEach(li => Object.assign(li, {
    nodeId: genId(),
    path : ['l', li.path[1] + lastIndexL + 1],
    fromNodeId: nodeIdMappingR.get(li.fromNodeId),
    toNodeId: nodeIdMappingR.get(li.toNodeId)
  }))
  cbRR.forEach(ri => Object.assign(ri, {
    nodeId: nodeIdMappingRIterator.next().value[1],
    path: ['r', ri.path[1] + lastIndexR + 1],
    offsetW: (ri.offsetW ?? rSaveOptional.offsetW) + getG(m).selfW,
    offsetH: (ri.offsetH ?? rSaveOptional.offsetH) + getG(m).selfH
  }))
  cbRS.forEach(si => Object.assign(si, {
    nodeId: genId(),
    path: ['r', si.path.at(1) + lastIndexR + 1, ...si.path.slice(2)],
  }))
  cbRC.forEach(ci => Object.assign(ci, {
    nodeId: genId(),
    path: ['r', ci.path.at(1) + lastIndexR + 1, ...ci.path.slice(2)],
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbRR, ...cbRS, ...cbRC)
  m.sort(sortPath)
}

const clipboardToSC = (m: M, cbSS: S[], cbSC: C[], ip: PS) => {
  const offset = getXAS(m).length
  cbSS.forEach(si => Object.assign(si, {
    nodeId: genId(),
    path: [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)]
  }))
  cbSC.forEach(ci => Object.assign(ci, {
    nodeId: genId(),
    path: [...ip.slice(0, -2), 's', ip.at(-1) + ci.path.at(1), ...ci.path.slice(2)]
  }))
  offsetSC(m, ip, offset)
  unselectNodes(m)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const copyLRSC = (m: M) => {
  cbSave(mapDeInit([...lToClipboard(m), ...rrToClipboard(m), ...rsToClipboard(m), ...rcToClipboard(m)].sort(sortPath)))
}

export const copySC = (m: M) => {
  cbSave(mapDeInit([...ssToClipboard(m), ...scToClipboard(m)].sort(sortPath)))
}

export const pasteLRSC = (m: M, payload: any) => {
  const lrsc = JSON.parse(payload) as M
  clipboardToLRSC(m, mL(lrsc), mR(lrsc), mS(lrsc), mC(lrsc))
}

export const pasteSC = (m: M, ip: PS, payload: any) => {
  const sc = JSON.parse(payload) as M
  clipboardToSC(m, mS(sc), mC(sc), ip)
}

export const duplicateLRSC = (m: M) => {
  clipboardToLRSC(m, lToClipboard(m), rrToClipboard(m), rsToClipboard(m), rcToClipboard(m))
}

export const duplicateSC = (m: M) => {
  const ip = getXLS(m).path.with(-1, getXLS(m).path.at(-1) + 1) as PS
  clipboardToSC(m, ssToClipboard(m), scToClipboard(m), ip)
}

export const moveSC = (m: M, ip: PS) => {
  const offset = getXAS(m).length
  const cbSS = ssToClipboard(m)
  const cbSC = scToClipboard(m)
  deleteS(m)
  cbSS.forEach(si => Object.assign(si, {path: [...ip.with(-1, ip.at(-1) + si.path.at(1)), ...si.path.slice(2)]}))
  cbSC.forEach(ci => Object.assign(ci, {path: [...ip.with(-1, ip.at(-1) + ci.path.at(1)), ...ci.path.slice(2)]}))
  offsetSC(m, ip, offset)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const moveCL = (m: M, orig: C[], swap: C[], index: number, offset: number) => {
  orig.flatMap(si => [si, ...si.so]).forEach(ti => ti.path[index] += offset)
  swap.flatMap(si => [si, ...si.so]).forEach(ti => ti.path[index] -= offset)
  m.sort(sortPath)
}

export const moveS2T = (m: M) => {
  const pos = getXS(m).path.length - 1 + 1
  getXS(m).so1.flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => Object.assign(ti, {path: [...ti.path.slice(0, pos), 's', 0, 'c', ti.path.at(pos + 1), 0, 's', 0, ...ti.path.slice(pos + 2)]}))
  const cellIndices = Array.from({length: getXS(m).so1.length}, (_, i) => ([i, 0]))
  const ip = [...getXS(m).path, 's', 0]
  unselectNodes(m)
  m.push(({nodeId: genId(), path: ip as PS, selected: 1} as S))
  m.push(...cellIndices.map(el => ({nodeId: genId(), path: [...ip, 'c', ...el] as PC} as C)))
  m.sort(sortPath)
}

export const transpose = (m: M) => {
  const pos = getXS(m).path.length
  getXS(m).co.forEach(ci => ci.path = [...ci.path.slice(0, pos), 'c', ci.path.at(pos + 2), ci.path.at(pos + 1), ...ci.path.slice(pos + 3)] as PC)
  getXS(m).so.forEach(si => si.path = [...si.path.slice(0, pos), 'c', si.path.at(pos + 2), si.path.at(pos + 1), ...si.path.slice(pos + 3)] as PS)
}
