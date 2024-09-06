import {G, GSaveOptional, L, LSaveOptional, R, RSaveAlways, RSaveOptional, S, SSaveAlways, SSaveOptional, C, CSaveAlways, CSaveOptional, MPartial} from "../state/MapStateTypes"
import {gSaveNever, gSaveOptional, lSaveNever, lSaveOptional, rSaveAlways, rSaveNever, rSaveOptional, sSaveAlways, sSaveNever, sSaveOptional, cSaveAlways, cSaveNever, cSaveOptional} from "../state/MapState"
import {genId} from "../utils/Utils"
import {isC, isG, isL, isR, isS} from "../mapQueries/PathQueries.ts";

export const mapInit = (m: MPartial) => {
  m.forEach(ni => {
    switch (true) {
      case isG(ni.path): {
        const g = ni as G
        for (const prop in gSaveOptional) {
          if (!Object.hasOwn(g, prop)) {
            Object.assign(g, {[prop]: structuredClone(gSaveOptional[prop as keyof GSaveOptional])})
          }
        }
        Object.assign(g, structuredClone(gSaveNever))
        break
      }
      case isL(ni.path): {
        const li = ni as L
        for (const prop in lSaveOptional) {
          if (!Object.hasOwn(li, prop)) {
            Object.assign(li, {[prop]: structuredClone(lSaveOptional[prop as keyof LSaveOptional])})
          }
        }
        Object.assign(li, structuredClone(lSaveNever))
        break
      }
      case isR(ni.path): {
        const ri = ni as R
        for (const prop in rSaveAlways) {
          if (!Object.hasOwn(ri, prop)) {
            if (prop === 'nodeId') {
              ri[prop] = genId()
            } else {
              Object.assign(ri, {[prop]: structuredClone(rSaveAlways[prop as keyof RSaveAlways])})
            }
          }
        }
        for (const prop in rSaveOptional) {
          if (!Object.hasOwn(ri, prop)) {
            Object.assign(ri, {[prop]: structuredClone(rSaveOptional[prop as keyof RSaveOptional])})
          }
        }
        Object.assign(ri, structuredClone(rSaveNever))
        break
      }
      case isS(ni.path): {
        const si = ni as S
        for (const prop in sSaveAlways) {
          if (!Object.hasOwn(si, prop)) {
            if (prop === 'nodeId') {
              si[prop] = genId()
            } else {
              Object.assign(si, {[prop]: structuredClone(sSaveAlways[prop as keyof SSaveAlways])})
            }
          }
        }
        for (const prop in sSaveOptional) {
          if (!Object.hasOwn(si, prop)) {
            Object.assign(si, {[prop]: structuredClone(sSaveOptional[prop as keyof SSaveOptional])})
          }
        }
        Object.assign(si, structuredClone(sSaveNever))
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        for (const prop in cSaveAlways) {
          if (!Object.hasOwn(ci, prop)) {
            if (prop === 'nodeId') {
              ci[prop] = genId()
            } else {
              Object.assign(ci, {[prop]: structuredClone(cSaveAlways[prop as keyof CSaveAlways])})
            }
          }
        }
        for (const prop in cSaveOptional) {
          if (!Object.hasOwn(ci, prop)) {
            Object.assign(ci, {[prop]: structuredClone(cSaveOptional[prop as keyof CSaveOptional])})
          }
        }
        Object.assign(ci, structuredClone(cSaveNever))
        break
      }
    }
  })
}
