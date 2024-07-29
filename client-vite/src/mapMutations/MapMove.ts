import {getG, getLastIndexL, getLastIndexR, getXAC, getXAS, getXLS, getXS, idToC, idToS, mC, mG, mL, mR, mS} from "../mapQueries/MapQueries.ts"
import {rSaveOptional} from "../state/MapState"
import {C, L, M, PC, PS, R, S} from "../state/MapStateTypes"
import {genNodeId} from "../utils/Utils"
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
  const nodeIdMappingR = new Map<string, string>(cbRR.map(ri => [ri.nodeId, genNodeId()]))
  const nodeIdMappingRIterator = nodeIdMappingR[Symbol.iterator]()
  cbL.forEach(li => Object.assign(li, {
    nodeId: genNodeId(),
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
    nodeId: genNodeId(),
    path: ['r', si.path.at(1) + lastIndexR + 1, ...si.path.slice(2)],
  }))
  cbRC.forEach(ci => Object.assign(ci, {
    nodeId: genNodeId(),
    path: ['r', ci.path.at(1) + lastIndexR + 1, ...ci.path.slice(2)],
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbRR, ...cbRS, ...cbRC)
  m.sort(sortPath)
}

const clipboardToSC = (m: M, cbSS: S[], cbSC: C[], ip: PS) => {
  const offset = getXAS(m).length
  cbSS.forEach(si => Object.assign(si, {
    nodeId: genNodeId(),
    path: [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)]
  }))
  cbSC.forEach(ci => Object.assign(ci, {
    nodeId: genNodeId(),
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
  const xas = getXAS(m)
  const cbSS = ssToClipboard(m)
  const cbSC = scToClipboard(m)
  deleteS(m)
  cbSS.forEach(si => Object.assign(si, {path: [...ip.with(-1, ip.at(-1) + si.path.at(1)), ...si.path.slice(2)]}))
  cbSC.forEach(ci => Object.assign(ci, {path: [...ip.with(-1, ip.at(-1) + ci.path.at(1)), ...ci.path.slice(2)]}))
  offsetSC(m, ip, xas.length)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const moveCL = (m: M, index: number, offset: number, dir: 'cd' | 'cu' | 'cr' | 'cl') => {
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(index, 1, si.path.at(index) + offset))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(index, 1, ci.path.at(index) + offset))
  getXAC(m).map(ci => idToC(m, ci[dir].at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(index, 1, si.path.at(index) - offset))
  getXAC(m).map(ci => idToC(m, ci[dir].at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(index, 1, ci.path.at(index) - offset))
  m.sort(sortPath)
}

export const moveS2T = (m: M) => {
  const pos = getXS(m).path.length
  const so = getXS(m).so
  m.splice(0, m.length,
    ...[
      ...mG(m),
      ...mL(m),
      ...mR(m),
      ...mS(m).filter(si => !so.includes(si.nodeId)).map(si => ({...si, selected: 0})),
      ...mS(m).filter(si => so.includes(si.nodeId)).map(si => ({...si, path: [...si.path.slice(0, pos), 's', 0, 'c', si.path.at(pos + 1), 0, 's', 0, ...si.path.slice(pos + 2)] as PS})),
      ...[{nodeId: genNodeId(), path: [...getXS(m).path, 's', 0] as PS, selected: 1} as S],
      ...Array.from({length: getXS(m).so1.length}, (_, i) => ({nodeId: genNodeId(), path: [...getXS(m).path, 's', 0, 'c', i, 0] as PC, selected: 0} as C)),
      ...mC(m)
    ].sort(sortPath)
  )
}

export const transpose = (m: M) => {
  const pos = getXS(m).path.length
  getXS(m).co.map(nid => idToC(m, nid)).forEach(ci => ci.path = [...ci.path.slice(0, pos), 'c', ci.path.at(pos + 2), ci.path.at(pos + 1), ...ci.path.slice(pos + 3)] as PC)
  getXS(m).so.map(nid => idToS(m, nid)).forEach(si => si.path = [...si.path.slice(0, pos), 'c', si.path.at(pos + 2), si.path.at(pos + 1), ...si.path.slice(pos + 3)] as PS)
}
