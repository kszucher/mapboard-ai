import {isC, isG, isL, isR, isS} from "../mapQueries/PathQueries.ts"
import {
  cSaveAlways,
  cSaveNever,
  cSaveOptional,
  gSaveAlways,
  gSaveNever,
  gSaveOptional,
  lSaveAlways,
  lSaveNever,
  lSaveOptional,
  rSaveAlways,
  rSaveNever,
  rSaveOptional,
  sSaveAlways,
  sSaveNever,
  sSaveOptional,
} from "../mapState/MapState.ts"
import {C, G, L, MPartial, R, S} from "../mapState/MapStateTypes.ts"
import {excludeEntries, genId} from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  m.forEach(ni => {
    switch (true) {
      case isG(ni.path): Object.assign(ni as G, structuredClone({...excludeEntries(gSaveAlways, Object.keys(ni)),...excludeEntries(gSaveOptional, Object.keys(ni)), ...gSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isL(ni.path): Object.assign(ni as L, structuredClone({...excludeEntries(lSaveAlways, Object.keys(ni)),...excludeEntries(lSaveOptional, Object.keys(ni)), ...lSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isR(ni.path): Object.assign(ni as R, structuredClone({...excludeEntries(rSaveAlways, Object.keys(ni)),...excludeEntries(rSaveOptional, Object.keys(ni)), ...rSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isS(ni.path): Object.assign(ni as S, structuredClone({...excludeEntries(sSaveAlways, Object.keys(ni)),...excludeEntries(sSaveOptional, Object.keys(ni)), ...sSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isC(ni.path): Object.assign(ni as C, structuredClone({...excludeEntries(cSaveAlways, Object.keys(ni)),...excludeEntries(cSaveOptional, Object.keys(ni)), ...cSaveNever}), {nodeId: ni.nodeId || genId()}); break
    }
  })
}
