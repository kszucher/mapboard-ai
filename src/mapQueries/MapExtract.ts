import {M, PR, PS, PC} from "../state/MapStateTypes.ts"
import {getAXR, getAXS, getFXS, getXS, idToR, mL} from "./MapQueries.ts"
import {rSaveOptional, sSaveOptional} from "../state/MapState.ts"

export const lrscToClipboard = (m: M): M => {
  const rMap = new Map(getAXR(m).map(((ri, i) => [ri.path.at(1), i])))
  const minOffsetW = Math.min(...getAXR(m).map(ri => ri.offsetW ?? rSaveOptional.offsetW))
  const minOffsetH = Math.min(...getAXR(m).map(ri => ri.offsetH ?? rSaveOptional.offsetH))
  return structuredClone([
    ...mL(m)
      .filter(li => idToR(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected)
      .map((li, i) => ({...li, path: ['l', i]})),
    ...getAXR(m).map((ri, i) => ({
      ...ri,
      path: ri.path.with(1, i) as PR,
      offsetW: (ri.offsetW ?? rSaveOptional.offsetW) - minOffsetW,
      offsetH: (ri.offsetH ?? rSaveOptional.offsetH) - minOffsetH
    })),
    ...getAXR(m).flatMap(ri => ri.so).map(si => ({
      ...si,
      path: si.path.with(1, rMap.get(si.path.at(1))) as PS,
      linkType: sSaveOptional.linkType,
      link: sSaveOptional.link
    })),
    ...getAXR(m).flatMap(ri => ri.co).map(ci => ({
      ...ci,
      path: ci.path.with(1, rMap.get(ci.path.at(1))) as PC
    }))
  ]) as M
}

export const scToClipboard = (m: M): M => {
  return structuredClone([
    ...getAXS(m).flatMap(si => [si, ...si.so]).map(si => ({
      ...si,
      path: ['s', si.path.at(getXS(m).path.length - 1) - getFXS(m).su.length, ...si.path.slice(getXS(m).path.length) as PS],
      linkType: sSaveOptional.linkType,
      link: sSaveOptional.link
    })),
    ...getAXS(m).flatMap(si => si.co).map(ci => ({
      ...ci,
      path: ['s', ci.path.at(getXS(m).path.length - 1) - getFXS(m).su.length, ...ci.path.slice(getXS(m).path.length) as PC],
    }))
  ]) as M
}
