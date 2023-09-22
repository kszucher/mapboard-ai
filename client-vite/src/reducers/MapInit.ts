import {GSaveOptional, GSaveNever, GPartial, TSaveAlways, TSaveOptional, TSaveNever, M, MPartial, LSaveOptional, LSaveNever} from "../state/MapStateTypes"
import {gSaveAlways, gSaveNever, gSaveOptional, lSaveAlways, lSaveNever, lSaveOptional, tSaveAlways, tSaveNever, tSaveOptional} from "../state/MapState"
import {mG, mL, mT} from "../selectors/MapSelector"
import {genHash} from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  mG(m as M).forEach(g => {
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
  })
  mL(m as M).forEach(l => {
    for (const prop in lSaveAlways) {
      // do nothing
    }
    for (const prop in lSaveOptional) {
      if (!l.hasOwnProperty(prop)) {
        Object.assign(l, {[prop]: structuredClone(lSaveOptional[prop as keyof LSaveOptional])})
      }
    }
    for (const prop in lSaveNever) {
      Object.assign(l, {[prop]: structuredClone(lSaveNever[prop as keyof LSaveNever])})
    }
  })
  mT(m as M).forEach(t => {
    for (const prop in tSaveAlways) {
      if (!t.hasOwnProperty(prop)) {
        if (prop === 'nodeId') {
          t[prop] = 'node' + genHash(8)
        } else {
          Object.assign(t, {[prop]: structuredClone(tSaveAlways[prop as keyof TSaveAlways])})
        }
      }
    }
    for (const prop in tSaveOptional) {
      if (!t.hasOwnProperty(prop)) {
        Object.assign(t, {[prop]: structuredClone(tSaveOptional[prop as keyof TSaveOptional])})
      }
    }
    for (const prop in tSaveNever) {
      Object.assign(t, {[prop]: structuredClone(tSaveNever[prop as keyof TSaveNever])})
    }
  })
}
