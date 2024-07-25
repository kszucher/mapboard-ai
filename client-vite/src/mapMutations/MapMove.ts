import {getG, getXAC, getXAS, getXC, getXFS, getXS, idToC, idToS, mC, mG, mL, mR, mS} from "../mapQueries/MapQueries.ts"
import {rSaveOptional} from "../state/MapState"
import {C, L, M, PC, PL, PR, PS, R, S} from "../state/MapStateTypes"
import {genNodeId, IS_TESTING} from "../utils/Utils"
import {deleteLR, deleteS} from "./MapDelete"
import {mapDeInit} from "./MapDeInit"
import {unselectNodes} from "./MapSelect"
import {sortPath} from "./MapSort.ts"
import {isCEODO, isSEODO} from "../mapQueries/PathQueries.ts";
import {getClipboardL, getClipboardRC, getClipboardRR, getClipboardRS, getClipboardSC, getClipboardSS} from "../mapQueries/MapExtract.ts"

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

const cbToLRSC = (m: M, cbL: L[], cbRR: R[], cbRS: S[], cbRC: C[], ipL: PL, ipR: PR) => {
  const nodeIdMappingR = cbRR.map(ri => ({
    oldNodeId: ri.nodeId,
    newNodeId: IS_TESTING ? ['r', (ri.path.at(1) as number) + (ipR.at(-1) as number), ...ri.path.slice(2)].join('') : genNodeId()
  }))
  cbL.forEach(li => Object.assign(li, {
    nodeId: IS_TESTING ? ['l', (li.path.at(1) as number) + (ipL.at(1) as number)].join('') : genNodeId(),
    path : ['l', (li.path.at(1) as number) + (ipL.at(1) as number)],
    fromNodeId: nodeIdMappingR.find(el => el.oldNodeId === li.fromNodeId)?.newNodeId,
    toNodeId: nodeIdMappingR.find(el => el.oldNodeId === li.toNodeId)?.newNodeId
  }))
  cbRR.forEach((ri, i) => Object.assign(ri, {
    nodeId: nodeIdMappingR[i].newNodeId,
    path: ['r', (ri.path.at(1) as number) + (ipR.at(-1) as number), ...ri.path.slice(2)],
    offsetW: (ri.offsetW ? ri.offsetW : rSaveOptional.offsetW) + getG(m).selfW,
    offsetH: (ri.offsetH ? ri.offsetH : rSaveOptional.offsetH) + getG(m).selfH
  }))
  cbRS.forEach(si => Object.assign(si, {
    nodeId: IS_TESTING ? ['r', si.path.at(1) + ipR.at(-1), ...si.path.slice(2)].join('') : genNodeId(),
    path: ['r', si.path.at(1) + ipR.at(-1), ...si.path.slice(2)],
  }))
  cbRC.forEach(ci => Object.assign(ci, {
    nodeId: IS_TESTING ? ['r', ci.path.at(1) + ipR.at(-1), ...ci.path.slice(2)].join('') : genNodeId(),
    path: ['r', ci.path.at(1) + ipR.at(-1), ...ci.path.slice(2)],
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbRR, ...cbRS, ...cbRC)
  m.sort(sortPath)
}

const cbToSC = (m: M, cbSS: S[], cbSC: C[], ip: PS, xasLength: number) => {
  const pathSS = cbSS.map(si => [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)])
  const pathSC = cbSC.map(ci => [...ip.slice(0, -2), 's', ip.at(-1) + ci.path.at(1), ...ci.path.slice(2)])
  cbSS.forEach((si, i) => Object.assign(si, {nodeId: IS_TESTING ? pathSS[i].join('') : genNodeId(), path: pathSS[i]}))
  cbSC.forEach((si, i) => Object.assign(si, {nodeId: IS_TESTING ? pathSC[i].join('') : genNodeId(), path: pathSC[i]}))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + xasLength))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + xasLength))
  unselectNodes(m)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const cutLRSC = (m: M) => {
  const cbL = getClipboardL(m)
  const cbRR = getClipboardRR(m)
  const cbRS = getClipboardRS(m)
  const cbRC = getClipboardRC(m)
  cbSave(mapDeInit([...cbL, ...cbRR, ...cbRS, ...cbRC]))
  deleteLR(m)
}

export const cutSC = (m: M) => {
  const cbSS = getClipboardSS(m)
  const cbSC = getClipboardSC(m)
  cbSave(mapDeInit([...cbSS, ...cbSC].sort(sortPath)))
  deleteS(m)
}

export const copyLRSC = (m: M) => {
  const cbL = getClipboardL(m)
  const cbRR = getClipboardRR(m)
  const cbRS = getClipboardRS(m)
  const cbRC = getClipboardRC(m)
  cbSave(mapDeInit([...cbL, ...cbRR, ...cbRS, ...cbRC]))
}

export const copySC = (m: M) => {
  const cbSS = getClipboardSS(m)
  const cbSC = getClipboardSC(m)
  cbSave(mapDeInit([...cbSS, ...cbSC].sort(sortPath)))
}

export const pasteLRSC = (m: M, payload: any) => {
  const ipL = ['l', (mL(m).at(-1)?.path.at(1) as number || 0) + 1] as PL
  const ipR = ['r', mR(m).at(-1)!.path.at(1) as number + 1] as PR
  const cbLRSC = JSON.parse(payload) as M
  const cbL = mL(cbLRSC)
  const cbR = mR(cbLRSC)
  const cbS = mS(cbLRSC)
  const cbC = mC(cbLRSC)
  cbToLRSC(m, cbL, cbR, cbS, cbC, ipL, ipR)
}

export const pasteSC = (m: M, ip: PS, payload: any) => {
  const xas = JSON.parse(payload) as M
  const xasLength = xas.length
  const cbSS = mS(xas)
  const cbSC = mC(xas)
  cbToSC(m, cbSS, cbSC, ip, xasLength)
}

export const duplicateRSC = (m: M) => {
  const ipL = ['l', (mL(m).at(-1)?.path.at(1) as number || 0) + 1] as PL
  const ipR = ['r', mR(m).at(-1)!.path.at(1) as number + 1] as PR
  const cbL = getClipboardL(m)
  const cbRR = getClipboardRR(m)
  const cbRS = getClipboardRS(m)
  const cbRC = getClipboardRC(m)
  cbToLRSC(m, cbL, cbRR, cbRS, cbRC, ipL, ipR)
}

export const duplicateSC = (m: M) => {
  const ip = [...getXS(m).path.slice(0, -2), 's', getXFS(m).su.length + getXAS(m).length] as PS
  const xas = getXAS(m)
  const xasLength = xas.length
  const cbSS = getClipboardSS(m)
  const cbSC = getClipboardSC(m)
  cbToSC(m, cbSS, cbSC, ip, xasLength)
}

export const moveSC = (m: M, ip: PS) => {
  const xas = getXAS(m)
  const xasLength = xas.length
  const cbSS = getClipboardSS(m)
  const cbSC = getClipboardSC(m)
  deleteS(m)
  cbSS.forEach(si => Object.assign(si, {path: [...ip.with(-1, ip.at(-1) + si.path.at(1)), ...si.path.slice(2)]}))
  cbSC.forEach(ci => Object.assign(ci, {path: [...ip.with(-1, ip.at(-1) + ci.path.at(1)), ...ci.path.slice(2)]}))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) + xasLength))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) + xasLength))
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const moveCRD = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cd.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cd.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) - 1))
  m.sort(sortPath)
}

export const moveCRU = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) - 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cu.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(crIndex, 1, si.path.at(crIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cu.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(crIndex, 1, ci.path.at(crIndex) + 1))
  m.sort(sortPath)
}

export const moveCCR = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cr.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cr.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) - 1))
  m.sort(sortPath)
}

export const moveCCL = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) - 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cl.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(si => si.path.splice(ccIndex, 1, si.path.at(ccIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cl.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ci => ci.path.splice(ccIndex, 1, ci.path.at(ccIndex) + 1))
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
      ...[{
        nodeId: IS_TESTING ? [...getXS(m).path, 's', 0].join('') : genNodeId(),
        path: [...getXS(m).path, 's', 0] as PS, selected: 1
      } as S],
      ...Array.from({length: getXS(m).so1.length}, (_, i) => ({
        nodeId: IS_TESTING ? [...getXS(m).path, 's', 0, 'c', i, 0].join('') : genNodeId(),
        path: [...getXS(m).path, 's', 0, 'c', i, 0] as PC,
        selected: 0
      } as C)),
      ...mC(m)
    ].sort(sortPath)
  )
}

export const transpose = (m: M) => {
  const pos = getXS(m).path.length
  getXS(m).co.map(nid => idToC(m, nid)).forEach(ci => ci.path = [...ci.path.slice(0, pos), 'c', ci.path.at(pos + 2), ci.path.at(pos + 1), ...ci.path.slice(pos + 3)] as PC)
  getXS(m).so.map(nid => idToS(m, nid)).forEach(si => si.path = [...si.path.slice(0, pos), 'c', si.path.at(pos + 2), si.path.at(pos + 1), ...si.path.slice(pos + 3)] as PS)
}
