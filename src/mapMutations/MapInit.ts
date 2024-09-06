import {G, L, R, S, C, MPartial} from "../state/MapStateTypes"
import {gSaveAlways, gSaveNever, gSaveOptional, lSaveAlways, lSaveNever, lSaveOptional, rSaveAlways, rSaveNever, rSaveOptional, sSaveAlways, sSaveNever, sSaveOptional, cSaveAlways, cSaveNever, cSaveOptional,} from "../state/MapState"
import {excludeKeys, genId} from "../utils/Utils"
import {isC, isG, isL, isR, isS} from "../mapQueries/PathQueries.ts"

export const mapInit = (m: MPartial) => {
  m.forEach(ni => {
    switch (true) {
      case isG(ni.path): Object.assign(ni as G, structuredClone({...excludeKeys(gSaveAlways, Object.keys(ni)),...excludeKeys(gSaveOptional, Object.keys(ni)), ...gSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isL(ni.path): Object.assign(ni as L, structuredClone({...excludeKeys(lSaveAlways, Object.keys(ni)),...excludeKeys(lSaveOptional, Object.keys(ni)), ...lSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isR(ni.path): Object.assign(ni as R, structuredClone({...excludeKeys(rSaveAlways, Object.keys(ni)),...excludeKeys(rSaveOptional, Object.keys(ni)), ...rSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isS(ni.path): Object.assign(ni as S, structuredClone({...excludeKeys(sSaveAlways, Object.keys(ni)),...excludeKeys(sSaveOptional, Object.keys(ni)), ...sSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isC(ni.path): Object.assign(ni as C, structuredClone({...excludeKeys(cSaveAlways, Object.keys(ni)),...excludeKeys(cSaveOptional, Object.keys(ni)), ...cSaveNever}), {nodeId: ni.nodeId || genId()}); break
    }
  })
}
