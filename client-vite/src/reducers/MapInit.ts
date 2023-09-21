import {GSaveOptional, GSaveNever, GPartial, NSaveAlways, NSaveOptional, NSaveNever, M, MPartial, LSaveOptional, LSaveNever} from "../state/MapStateTypes"
import {gSaveAlways, gSaveNever, gSaveOptional, lSaveAlways, lSaveNever, lSaveOptional, nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapState"
import {getNodeByPath, isG, isL} from "../selectors/MapSelector"
import {genHash} from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  const g = getNodeByPath(m as M, ['g']) as GPartial
  m.forEach(n => {
    if (isG(n.path)) {
      for (const prop in gSaveAlways) {
        // do nothing
      }
      for (const prop in gSaveOptional) {
        if (!g.hasOwnProperty(prop)) {
          Object.assign(g, {[prop]: structuredClone(gSaveOptional[prop as keyof GSaveOptional])})
        }
      }
      for (const prop in gSaveNever) {
        Object.assign(g, {[prop]: structuredClone(gSaveNever[prop as keyof GSaveNever])})
      }
      g.sLineDeltaXDefault = g.density === 'large' ? 30 : 20 // 30 = 14 + 2*8, 20 = 14 + 2*3
    } else if (isL(n.path)){
      for (const prop in lSaveAlways) {
        // do nothing
      }
      for (const prop in lSaveOptional) {
        if (!g.hasOwnProperty(prop)) {
          Object.assign(g, {[prop]: structuredClone(lSaveOptional[prop as keyof LSaveOptional])})
        }
      }
      for (const prop in lSaveNever) {
        Object.assign(g, {[prop]: structuredClone(lSaveNever[prop as keyof LSaveNever])})
      }
    } else {
      for (const prop in nSaveAlways) {
        if (!n.hasOwnProperty(prop)) {
          if (prop === 'nodeId') {
            n[prop] = 'node' + genHash(8)
          } else {
            Object.assign(n, {[prop]: structuredClone(nSaveAlways[prop as keyof NSaveAlways])})
          }
        }
      }
      for (const prop in nSaveOptional) {
        if (!n.hasOwnProperty(prop)) {
          Object.assign(n, {[prop]: structuredClone(nSaveOptional[prop as keyof NSaveOptional])})
        }
      }
      for (const prop in nSaveNever) {
        Object.assign(n, {[prop]: structuredClone(nSaveNever[prop as keyof NSaveNever])})
      }
    }
  })
}
