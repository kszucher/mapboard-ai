import {getG, getLastIndexL, getLastIndexR, getAXS, getLXS, getXS, mC, mL, mR, mS,} from "../mapQueries/MapQueries.ts"
import {rSaveOptional} from "../state/MapState"
import {C, L, M, PC, PS, R, S} from "../state/MapStateTypes"
import {genId} from "../utils/Utils"
import {mapDeInit} from "./MapDeInit"
import {unselectNodes} from "./MapSelect"
import {sortPath} from "./MapSort.ts"
import {lToClipboard, rcToClipboard, rrToClipboard, rsToClipboard, scToClipboard, ssToClipboard} from "../mapQueries/MapExtract.ts"

const formatCb = (m: M) => "[\n" + m.map((e) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

const cbSave = (cb: M) => {
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
  cbSS.forEach(si => Object.assign(si, {
    nodeId: genId(),
    path: [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)]
  }))
  cbSC.forEach(ci => Object.assign(ci, {
    nodeId: genId(),
    path: [...ip.slice(0, -2), 's', ip.at(-1) + ci.path.at(1), ...ci.path.slice(2)]
  }))
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

export const pasteLRSC = (m: M, payload: string) => {
  const lrsc = JSON.parse(payload) as M
  clipboardToLRSC(m, mL(lrsc), mR(lrsc), mS(lrsc), mC(lrsc))
}

export const pasteSC = (m: M, ip: PS, payload: string) => {
  const sc = JSON.parse(payload) as M
  clipboardToSC(m, mS(sc), mC(sc), ip)
}

export const duplicateLRSC = (m: M) => {
  clipboardToLRSC(m, lToClipboard(m), rrToClipboard(m), rsToClipboard(m), rcToClipboard(m))
}

export const duplicateSC = (m: M) => {
  const ip = getLXS(m).path.with(-1, getLXS(m).path.at(-1) + 1) as PS
  const offset = getAXS(m).length
  const offsetDown = getLXS(m).sd
  offsetDown.flatMap(si => [si, ...si.so, ...si.co]).map(ti => ti.path[ip.length - 1] += offset)
  clipboardToSC(m, ssToClipboard(m), scToClipboard(m), ip)
}

export const moveSC = (m: M, sL: R | S | C, sU: S | undefined, sD: S | undefined) => {
  const axs = getAXS(m)
  const sDX = getLXS(m).sd.at(-1)
  const pos = getXS(m).path.length - 1
  const offset = axs.length
  const sMap = new Map(axs.map(((si, i) => [si.path.at(-1), i])))
  if (sDX) [sDX, ...sDX.sd].flatMap(si => [si, ...si.so, ...si.co]).map(ti => ti.path[sDX.path.length - 1] -= offset)
  if (sD) [sD, ...sD.sd].filter(ti => !ti.selected).flatMap(si => [si, ...si.so, ...si.co]).map(ti => ti.path[sD.path.length - 1] += offset)
  axs.flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => ti.path.splice(0, pos + 1, ...sL.path, 's', (sU ? sU.path.at(-1) + 1 : 0) + sMap.get(ti.path.at(pos))))
  m.sort(sortPath)
}

export const moveCL = (m: M, orig: C[], swap: C[], index: number, offset: number) => {
  orig.flatMap(si => [si, ...si.so]).forEach(ti => ti.path[index] += offset)
  swap.flatMap(si => [si, ...si.so]).forEach(ti => ti.path[index] -= offset)
  m.sort(sortPath)
}

export const moveS2T = (m: M) => {
  const pos = getXS(m).path.length - 1
  getXS(m).so1.flatMap(si => [si, ...si.so, ...si.co]).forEach(ti => ti.path.splice(pos + 1, 2, 's', 0, 'c', ti.path[pos + 2], 0, 's', 0))
  const cellIndices = Array.from({length: getXS(m).so1.length}, (_, i) => ([i, 0]))
  const ip = [...getXS(m).path, 's', 0]
  unselectNodes(m)
  m.push(({path: ip as PS, selected: 1} as S))
  m.push(...cellIndices.map(el => ({path: [...ip, 'c', ...el] as PC} as C)))
  m.sort(sortPath)
}

export const transpose = (m: M) => {
  const pos = getXS(m).path.length - 1
  getXS(m).co.flatMap(ci => [ci, ...ci.so]).forEach(ti => ti.path.splice(pos + 2, 2, ti.path[pos + 3], ti.path[pos + 2]))
}
