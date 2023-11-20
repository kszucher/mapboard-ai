import {GSaveOptional, GSaveNever, TSaveAlways, TSaveOptional, TSaveNever, M, MPartial, LSaveOptional, LSaveNever} from "../state/MapStateTypes"
import {gSaveNever, gSaveOptional, lSaveNever, lSaveOptional, tSaveAlways, tSaveNever, tSaveOptional} from "../state/MapState"
import {mG, mL, mT} from "../selectors/MapSelector"
import {genHash} from "../utils/Utils"

export const mapInit = (m: MPartial) => {
  mG(m as M).forEach(g => {
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
  mL(m as M).forEach(li => {
    for (const prop in lSaveOptional) {
      if (!li.hasOwnProperty(prop)) {
        Object.assign(li, {[prop]: structuredClone(lSaveOptional[prop as keyof LSaveOptional])})
      }
    }
    for (const prop in lSaveNever) {
      Object.assign(li, {[prop]: structuredClone(lSaveNever[prop as keyof LSaveNever])})
    }
  })
  mT(m as M).forEach(ti => {
    for (const prop in tSaveAlways) {
      if (!ti.hasOwnProperty(prop)) {
        if (prop === 'nodeId') {
          ti[prop] = 'node' + genHash(8)
        } else {
          Object.assign(ti, {[prop]: structuredClone(tSaveAlways[prop as keyof TSaveAlways])})
        }
      }
    }
    for (const prop in tSaveOptional) {
      if (!ti.hasOwnProperty(prop)) {
        Object.assign(ti, {[prop]: structuredClone(tSaveOptional[prop as keyof TSaveOptional])})
      }
    }
    for (const prop in tSaveNever) {
      Object.assign(ti, {[prop]: structuredClone(tSaveNever[prop as keyof TSaveNever])})
    }
  })
  return m
}
