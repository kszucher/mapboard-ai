import {isG, isL, isR} from "../mapQueries/PathQueries.ts"
import {
  gSaveAlways,
  gSaveNever,
  gSaveOptional,
  lSaveAlways,
  lSaveNever,
  lSaveOptional,
  rSaveAlways,
  rSaveNever,
  rSaveOptional,
} from "../mapState/MapState.ts"
import {G, L, MPartial, R} from "../mapState/MapStateTypes.ts"
import {excludeEntries, genId} from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  m.forEach(ni => {
    switch (true) {
      case isG(ni.path): Object.assign(ni as G, structuredClone({...excludeEntries(gSaveAlways, Object.keys(ni)),...excludeEntries(gSaveOptional, Object.keys(ni)), ...gSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isL(ni.path): Object.assign(ni as L, structuredClone({...excludeEntries(lSaveAlways, Object.keys(ni)),...excludeEntries(lSaveOptional, Object.keys(ni)), ...lSaveNever}), {nodeId: ni.nodeId || genId()}); break
      case isR(ni.path): Object.assign(ni as R, structuredClone({...excludeEntries(rSaveAlways, Object.keys(ni)),...excludeEntries(rSaveOptional, Object.keys(ni)), ...rSaveNever}), {nodeId: ni.nodeId || genId()}); break
    }
  })
}
