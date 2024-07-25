import {C, L, M, PC, PR, PS, R, S} from "../state/MapStateTypes.ts"
import {getXAR, getXAS, getXFS, getXS, idToC, idToR, idToS, mL} from "./MapQueries.ts"
import {rSaveOptional, sSaveOptional} from "../state/MapState.ts"

export const getClipboardL = (m: M): L[] => {
  return structuredClone(mL(m)
    .filter(li => idToR(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected)
    .map((li, i) => ({...li, path: ['l', i]}))
  )
}

export const getClipboardRR = (m: M): R[] => {
  const nonSelectedMinOffsetW = Math.min(...getXAR(m).map(ri => ri.offsetW || rSaveOptional.offsetW))
  const nonSelectedMinOffsetH = Math.min(...getXAR(m).map(ri => ri.offsetH || rSaveOptional.offsetH))
  const xarIndices = getXAR(m).map(ri => ri.path.at(1))
  return structuredClone(getXAR(m).map(ri => ({
    ...ri,
    path: ri.path.with(1, xarIndices.indexOf(ri.path.at(1))) as PR,
    offsetW: (ri.offsetW ? ri.offsetW : rSaveOptional.offsetW) - nonSelectedMinOffsetW,
    offsetH: (ri.offsetH ? ri.offsetH : rSaveOptional.offsetH) - nonSelectedMinOffsetH
  })))
}

export const getClipboardRS = (m: M): S[] => {
  const xarIndices = getXAR(m).map(ri => ri.path.at(1))
  return structuredClone(getXAR(m).flatMap(ri => ri.so).map(nid => idToS(m, nid)).map(si => ({
    ...si,
    path: si.path.with(1, xarIndices.indexOf(si.path.at(1))) as PS,
    linkType: sSaveOptional.linkType,
    link: sSaveOptional.link
  })))
}

export const getClipboardRC = (m: M): C[] => {
  const xarIndices = getXAR(m).map(ri => ri.path.at(1))
  return structuredClone(getXAR(m).flatMap(ri => ri.co).map(nid => idToC(m, nid)).map(ci => ({
    ...ci,
    path: ci.path.with(1, xarIndices.indexOf(ci.path.at(1))) as PC
  })))
}

export const getClipboardSS = (m: M): S[] => {
  return structuredClone(getXAS(m).flatMap(si => [si.nodeId, ...si.so]).map(nid => idToS(m, nid)).map(si => ({
    ...si,
    path: ['s', si.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...si.path.slice(getXS(m).path.length) as PS],
    linkType: sSaveOptional.linkType,
    link: sSaveOptional.link
  })))
}

export const getClipboardSC = (m: M): C[] => {
  return structuredClone(getXAS(m).flatMap(si => si.co).map(nid => idToC(m, nid)).map(ci => ({
    ...ci,
    path: ['s', ci.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...ci.path.slice(getXS(m).path.length) as PC],
  })))
}
