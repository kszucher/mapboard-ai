import {getG, mL, mR, sortPath, getXFS, getXAC, getXC, isSEODO, getXAS, mS, mC, getXS, mG, idToC, idToS, idToR, getXAR, isCEODO} from "../queries/MapQueries.ts"
import {rSaveOptional, sSaveOptional} from "../state/MapState"
import {M, L, T, PL, PR, PC, PS, S, R, C} from "../state/MapStateTypes"
import {generateCharacterFrom, genHash, genNodeId, IS_TESTING} from "../utils/Utils"
import {deleteLR, deleteS} from "./MapDelete"
import {mapDeInit} from "./MapDeInit"
import {unselectNodes} from "./MapSelect"

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

const getClipboardL = (m: M): L[] => {
  return structuredClone(mL(m)
    .filter(li => idToR(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected)
    .map((li, i) => ({...li, path: ['l', i]}))
  )
}

const getClipboardRR = (m: M): R[] => {
  const xar = getXAR(m)
  return structuredClone(mR(m)
    .filter(ri => xar.some(xari => xari.path.at(1) === ri.path.at(1)))
    .map(ri => ({...ri, path: ri.path.with(1, xar.map(ri => ri.path.at(1)).indexOf(ri.path[1]))}))
  ) as R[]
}

const getClipboardRS = (m: M): S[] => {
  const xar = getXAR(m)
  return structuredClone(mS(m)
    .filter(si => xar.some(xari => xari.path.at(1) === si.path.at(1)))
    .map(si => ({...si, path: si.path.with(1, xar.map(ri => ri.path.at(1)).indexOf(si.path[1]))}))
  ) as S[]
}

const getClipboardRC = (m: M): C[] => {
  const xar = getXAR(m)
  return structuredClone(mC(m)
    .filter(ci => xar.some(xari => xari.path.at(1) === ci.path.at(1)))
    .map(ci => ({...ci, path: ci.path.with(1, xar.map(ri => ri.path.at(1)).indexOf(ci.path[1]))}))
  ) as C[]
}

const getClipboardSS = (m: M) => {
  const xas = getXAS(m)
  const xaseo = xas.flatMap(si => [si.nodeId, ...si.so])
  return structuredClone(mS(m)
    .filter(si => xaseo.includes(si.nodeId))
    .map(si => ({...si,
      path: ['s', si.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...si.path.slice(getXS(m).path.length) as PS],
      linkType: sSaveOptional.linkType,
      link: sSaveOptional.link
    })) as S[]
  )
}

const getClipboardSC = (m: M) => {
  const xas = getXAS(m)
  const xasco = xas.flatMap(si => si.co)
  return structuredClone(mC(m)
    .filter(ci => xasco.includes(ci.nodeId))
    .map(ci => ({...ci,
      path: ['s', ci.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...ci.path.slice(getXS(m).path.length) as PC]
    })) as C[]
  )
}

const cbToLRSC = (m: M, cbL: L[], cbRR: R[], cbRS: S[], cbRC: C[], ipL: PL, ipR: PR) => {
  const cb = [...cbRR, ...cbRS, ...cbRC].sort(sortPath)
  const nodeIdMapping = cb.map((ri, i) => ({
    oldNodeId: ri.nodeId,
    newNodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8)
  }))
  cbL.forEach((li, i) => Object.assign(li, {
    nodeId: IS_TESTING ? 'xl' + generateCharacterFrom('a', i) : 'node' + genHash(8),
    path : ['l', (li.path.at(1) as number) + (ipL.at(1) as number)],
    fromNodeId : nodeIdMapping.find(el => el.oldNodeId === li.fromNodeId)?.newNodeId || li.fromNodeSide,
    toNodeId: nodeIdMapping.find(el => el.oldNodeId === li.toNodeId)?.newNodeId || li.nodeId
  }))
  cb.forEach((ri, i) => Object.assign(ri, {
    nodeId: nodeIdMapping[i].newNodeId,
    path: ['r', ri.path.at(1) + ipR.at(-1), ...ri.path.slice(2)],
  }))
  const nonSelectedMinOffsetW = Math.min(...mR(cbRR).map(ri => ri.offsetW || rSaveOptional.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(cbRR).map(ri => ri.offsetH || rSaveOptional.offsetH))
  mR(cbRR).map(ri => Object.assign(ri, {
    offsetW: (ri.offsetW ? ri.offsetW : rSaveOptional.offsetW) - nonSelectedMinOffsetW + getG(m).selfW,
    offsetH: (ri.offsetH ? ri.offsetH : rSaveOptional.offsetH) - nonSelectedMinOffsetH + getG(m).selfH
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbRR, ...cbRS, ...cbRC)
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
  const ipR = ['r', mR(m).at(-1)?.path.at(1) as number + 1] as PR
  const cbLRSC = JSON.parse(payload) as M
  const cbL = mL(cbLRSC)
  const cbR = mR(cbLRSC)
  const cbS = mS(cbLRSC)
  const cbC = mC(cbLRSC)
  cbToLRSC(m, cbL, cbR, cbS, cbC, ipL, ipR)
}

export const pasteSC = (m: M, insertParentNode: T, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PS
  const xas = JSON.parse(payload) as M
  const xasLength = (xas).length
  const cbSS = mS(xas)
  const cbSC = mC(xas)
  cbSS.forEach((si, i) => Object.assign(si, {nodeId: genNodeId(i), path : [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)]}))
  cbSC.forEach((ci, i) => Object.assign(ci, {nodeId: genNodeId(i), path : [...ip.slice(0, -2), 's', ip.at(-1) + ci.path.at(1), ...ci.path.slice(2)]}))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) as number + xasLength))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) as number + xasLength))
  unselectNodes(m)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const duplicateRSC = (m: M) => {
  const ipL = ['l', mL(m).at(-1)!.path.at(1) as number + 1] as PL
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
  cbSS.forEach((si, i) => Object.assign(si, {nodeId: genNodeId(i), path : [...ip.slice(0, -2), 's', ip.at(-1) + si.path.at(1), ...si.path.slice(2)]}))
  cbSC.forEach((ci, i) => Object.assign(ci, {nodeId: genNodeId(i), path : [...ip.slice(0, -2), 's', ip.at(-1) + ci.path.at(1), ...ci.path.slice(2)]}))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) as number + xasLength))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) as number + xasLength))
  unselectNodes(m)
  m.push(...cbSS, ...cbSC)
  m.sort(sortPath)
}

export const moveSC = (m: M, ip: PS) => {
  const xas = getXAS(m)
  const xasLength = xas.length
  const cbSS = getClipboardSS(m)
  const cbSC = getClipboardSC(m)
  deleteS(m)
  cbSS.forEach(si => Object.assign(si, {path: [...ip.with(-1, ip.at(-1) + si.path.at(1)), ...si.path.slice(2)]}))
  cbSC.forEach(ci => Object.assign(ci, {path: [...ip.with(-1, ip.at(-1) + ci.path.at(1)), ...ci.path.slice(2)]}))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) as number + xasLength))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) as number + xasLength))
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
      ...[{nodeId: IS_TESTING ? 'xt_' : 'node' + genHash(8), path: [...getXS(m).path, 's', 0] as PS, selected: 1} as S],
      ...Array.from({length: getXS(m).so1.length}, (_, i) => ({nodeId: genNodeId(i), path: [...getXS(m).path, 's', 0, 'c', i, 0] as PC, selected: 0} as C)),
      ...mC(m)
    ].sort(sortPath)
  )
}

export const transpose = (m: M) => {
  const pos = getXS(m).path.length
  getXS(m).co.map(nid => idToC(m, nid)).forEach(ci => ci.path = [...ci.path.slice(0, pos), 'c', ci.path.at(pos + 2), ci.path.at(pos + 1), ...ci.path.slice(pos + 3)] as PC)
  getXS(m).so.map(nid => idToS(m, nid)).forEach(si => si.path = [...si.path.slice(0, pos), 'c', si.path.at(pos + 2), si.path.at(pos + 1), ...si.path.slice(pos + 3)] as PS)
}
