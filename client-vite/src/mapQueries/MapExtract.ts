import {C, L, M, PC, PR, PS, R, S} from "../state/MapStateTypes.ts"
import {getXAR, getXAS, getXFS, getXS, idToR, mL} from "./MapQueries.ts"
import {rSaveOptional, sSaveOptional} from "../state/MapState.ts"

export const lToClipboard = (m: M): L[] => {
  return structuredClone(mL(m)
    .filter(li => idToR(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected)
    .map((li, i) => ({...li, path: ['l', i]}))
  )
}

export const rrToClipboard = (m: M): R[] => {
  const nonSelectedMinOffsetW = Math.min(...getXAR(m).map(ri => ri.offsetW || rSaveOptional.offsetW))
  const nonSelectedMinOffsetH = Math.min(...getXAR(m).map(ri => ri.offsetH || rSaveOptional.offsetH))
  return structuredClone(getXAR(m).map((ri, i) => ({
    ...ri,
    path: ri.path.with(1, i) as PR,
    offsetW: (ri.offsetW ?? rSaveOptional.offsetW) - nonSelectedMinOffsetW,
    offsetH: (ri.offsetH ?? rSaveOptional.offsetH) - nonSelectedMinOffsetH
  })))
}

export const rsToClipboard = (m: M): S[] => {
  const rMap = new Map(getXAR(m).map(((ri, i) => [ri.path.at(1), i])))
  return structuredClone(getXAR(m).flatMap(ri => ri.so).map(si => ({
    ...si,
    path: si.path.with(1, rMap.get(si.path.at(1))) as PS,
    linkType: sSaveOptional.linkType,
    link: sSaveOptional.link
  })))
}

export const rcToClipboard = (m: M): C[] => {
  const rMap = new Map(getXAR(m).map(((ri, i) => [ri.path.at(1), i])))
  return structuredClone(getXAR(m).flatMap(ri => ri.co).map(ci => ({
    ...ci,
    path: ci.path.with(1, rMap.get(ci.path.at(1))) as PC
  })))
}

export const ssToClipboard = (m: M): S[] => {
  return structuredClone(getXAS(m).flatMap(si => [si, ...si.so]).map(si => ({
    ...si,
    path: ['s', si.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...si.path.slice(getXS(m).path.length) as PS],
    linkType: sSaveOptional.linkType,
    link: sSaveOptional.link
  })))
}

export const scToClipboard = (m: M): C[] => {
  return structuredClone(getXAS(m).flatMap(si => si.co).map(ci => ({
    ...ci,
    path: ['s', ci.path.at(getXS(m).path.length - 1) - getXFS(m).su.length, ...ci.path.slice(getXS(m).path.length) as PC],
  })))
}
