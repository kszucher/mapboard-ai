import { isG, isL, isR } from "../mapQueries/PathQueries.ts"
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
import { G, L, MPartial, R } from "../mapState/MapStateTypes.ts"
import { excludeEntries, genId } from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  m.forEach(ni => {
    switch (true) {
      case isG(ni.path):
        Object.assign(<G>ni, structuredClone({ ...excludeEntries(gSaveAlways, Object.keys(ni)), ...excludeEntries(gSaveOptional, Object.keys(ni)), ...gSaveNever }), { nodeId: ni.nodeId || genId() })
        break
      case isL(ni.path):
        Object.assign(<L>ni, structuredClone({ ...excludeEntries(lSaveAlways, Object.keys(ni)), ...excludeEntries(lSaveOptional, Object.keys(ni)), ...lSaveNever }), { nodeId: ni.nodeId || genId() })
        break
      case isR(ni.path):
        Object.assign(<R>ni, structuredClone({ ...excludeEntries(rSaveAlways, Object.keys(ni)), ...excludeEntries(rSaveOptional, Object.keys(ni)), ...rSaveNever }), { nodeId: ni.nodeId || genId() })
        break
    }
  })
}
