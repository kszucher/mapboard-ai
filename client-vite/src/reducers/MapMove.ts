import {getG, getNodeById, lToCb, mL, mR, rToCb, sortPath, sToCb, getXFS, getXAC, getXC, isSEODO, getXAS, mS, mC, getXS, mG, idToC, idToS} from "../queries/MapQueries.ts"
import {rSaveOptional, sSaveOptional} from "../state/MapState"
import {M, L, T, PT, PL, PR, C, PC, PS, S} from "../state/MapStateTypes"
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

const cbToLR = (m: M, cbL: L[], cbR: T[], ipL: PL, ipR: PR) => {
  const nodeIdMappingR = cbR.map((ti, i) => ({
    oldNodeId: ti.nodeId,
    newNodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8)
  }))
  cbL.forEach((li, i) => Object.assign(li, {
    nodeId: IS_TESTING ? 'xl' + generateCharacterFrom('a', i) : 'node' + genHash(8),
    path : ['l', (li.path.at(1) as number) + (ipL.at(1) as number)],
    fromNodeId : nodeIdMappingR.find(el => el.oldNodeId === li.fromNodeId)?.newNodeId || li.fromNodeSide,
    toNodeId: nodeIdMappingR.find(el => el.oldNodeId === li.toNodeId)?.newNodeId || li.nodeId
  }))
  cbR.forEach((ti, i) => Object.assign(ti, {
    nodeId: nodeIdMappingR[i].newNodeId,
    path: ['r', ti.path.at(1) + ipR.at(-1), ...ti.path.slice(2)],
  }))
  const nonSelectedMinOffsetW = Math.min(...mR(cbR).map(ri => ri.offsetW || rSaveOptional.offsetW))
  const nonSelectedMinOffsetH = Math.min(...mR(cbR).map(ri => ri.offsetH || rSaveOptional.offsetH))
  mR(cbR).map(ri => Object.assign(ri, {
    offsetW: (ri.offsetW ? ri.offsetW : rSaveOptional.offsetW) - nonSelectedMinOffsetW + getG(m).selfW,
    offsetH: (ri.offsetH ? ri.offsetH : rSaveOptional.offsetH) - nonSelectedMinOffsetH + getG(m).selfH
  }))
  unselectNodes(m)
  m.push(...cbL, ...cbR)
  m.sort(sortPath)
}

const cbToS = (m: M, cbS: M, ip: PT) => {
  cbS.forEach((ti, i) => Object.assign(ti, {
    nodeId: IS_TESTING ? 'xt' + generateCharacterFrom('a', i) : 'node' + genHash(8),
    path : [...ip.slice(0, -2), 's', ti.path.at(1) + ip.at(-1), ...ti.path.slice(2)],
    linkType: sSaveOptional.linkType,
    link: sSaveOptional.link
  }))
  mR(m).forEach(ri => isSEODO(ip, ri.path) && ri.path.splice(ip.length - 1, 1, ri.path.at(ip.length - 1) as number + getXAS(cbS).length))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) as number + getXAS(cbS).length))
  mC(m).forEach(ci => isSEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) as number + getXAS(cbS).length))
  unselectNodes(m)
  m.push(...cbS)
  m.sort(sortPath)
}

export const cutLR = (m: M) => {
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  cbSave(mapDeInit([...cbL, ...cbR]))
  deleteLR(m)
}

export const cutS = (m: M) => {
  const cbS = structuredClone(sToCb(m))
  cbSave(mapDeInit(cbS))
  deleteS(m)
}

export const copyLR = (m: M) => {
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  cbSave(mapDeInit([...cbL, ...cbR]))
}

export const copyS = (m: M) => {
  const cbS = structuredClone(sToCb(m))
  cbSave(mapDeInit(cbS))
}

export const pasteLR = (m: M, payload: any) => {
  const ipL = ['l', (mL(m).at(-1)?.path.at(1) as number || 0) + 1] as PL
  const ipR = ['r', mR(m).at(-1)?.path.at(1) as number + 1] as PR
  const cbLR = JSON.parse(payload) as M
  const cbL = mL(cbLR)
  const cbR = mR(cbLR)
  cbToLR(m, cbL, cbR, ipL, ipR)
}

export const pasteS = (m: M, insertParentNode: T, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as PT
  const cbS = JSON.parse(payload) as M
  cbToS(m, cbS, ip)
}

export const duplicateR = (m: M) => {
  const ipL = ['l', mL(m).at(-1)!.path.at(1) as number + 1] as PL
  const ipR = ['r', mR(m).at(-1)!.path.at(1) as number + 1] as PR
  const cbL = structuredClone(lToCb(m))
  const cbR = structuredClone(rToCb(m))
  cbToLR(m, cbL, cbR, ipL, ipR)
}

export const duplicateS = (m: M) => {
  const ip = [...getXS(m).path.slice(0, -2), 's', getXFS(m).su.length + getXAS(m).length] as PT
  const cbS = structuredClone(sToCb(m))
  cbToS(m, cbS, ip)
}

export const moveS = (m: M, insertParentNodeId: string, insertTargetIndex: number) => {
  const cbS = structuredClone(sToCb(m))
  deleteS(m)
  const ip = [...getNodeById(m, insertParentNodeId).path, 's', insertTargetIndex] as PT
  cbS.forEach(ti => Object.assign(ti, {
    path : [...ip.slice(0, -2), 's', ti.path.at(1) + ip.at(-1), ...ti.path.slice(2)]
  }))
  mS(m).forEach(si => isSEODO(ip, si.path) && si.path.splice(ip.length - 1, 1, si.path.at(ip.length - 1) as number + getXAS(cbS).length))
  mC(m).forEach(ci => isSEODO(ip, ci.path) && ci.path.splice(ip.length - 1, 1, ci.path.at(ip.length - 1) as number + getXAS(cbS).length))
  m.push(...cbS)
  m.sort(sortPath)
}

export const moveCRD = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cd.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cd.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) - 1))
  m.sort(sortPath)
}

export const moveCRU = (m: M) => {
  const crIndex = getXC(m).path.indexOf('c') + 1
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) - 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cu.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cu.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(crIndex, 1, ti.path.at(crIndex) + 1))
  m.sort(sortPath)
}

export const moveCCR = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cr.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cr.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) - 1))
  m.sort(sortPath)
}

export const moveCCL = (m: M) => {
  const ccIndex = getXC(m).path.indexOf('c') + 2
  getXAC(m).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) - 1))
  getXAC(m).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) - 1))
  getXAC(m).map(ci => idToC(m, ci.cl.at(-1)!)).flatMap(ci => ci.so).map(nid => idToS(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
  getXAC(m).map(ci => idToC(m, ci.cl.at(-1)!)).map(ci => ci.nodeId).map(nid => idToC(m, nid)).forEach(ti => ti.path.splice(ccIndex, 1, ti.path.at(ccIndex) + 1))
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
  getXS(m).co.map(ni => idToC(m, ni)).forEach(ti => ti.path = [...ti.path.slice(0, pos), 'c', ti.path.at(pos + 2), ti.path.at(pos + 1), ...ti.path.slice(pos + 3)] as PC)
  getXS(m).so.map(ni => idToS(m, ni)).forEach(ti => ti.path = [...ti.path.slice(0, pos), 'c', ti.path.at(pos + 2), ti.path.at(pos + 1), ...ti.path.slice(pos + 3)] as PS)
}
