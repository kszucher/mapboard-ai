import isEqual from "react-fast-compare"
import {M, GSaveNever, GSaveOptional, LSaveOptional, LSaveNever, G, L, R, RSaveOptional, RSaveNever, S, SSaveOptional, SSaveNever, C, CSaveOptional, CSaveNever, MPartial} from "../state/MapStateTypes"
import {cSaveOptional, gSaveOptional, lSaveOptional, rSaveOptional, sSaveOptional} from "../state/MapState"
import {isC, isG, isL, isR, isS, sortPath} from "../queries/MapQueries.ts"

export const mapDeInit = (m: M) => {
  const mPartial = structuredClone(m).sort(sortPath)
  mPartial.forEach(ni => {
    switch (true) {
      case isG(ni.path): {
        const g  = ni as G
        for (const prop in g) {
          if (gSaveOptional.hasOwnProperty(prop)) {
            if (isEqual(g[prop as keyof GSaveOptional], gSaveOptional[prop as keyof GSaveOptional])) {
              delete g[prop as keyof GSaveOptional]
            }
          } else {
            delete g[prop as keyof GSaveNever]
          }
        }
        break
      }
      case isL(ni.path): {
        const li = ni as L
        for (const prop in li) {
          if (lSaveOptional.hasOwnProperty(prop)) {
            if (isEqual(li[prop as keyof LSaveOptional], lSaveOptional[prop as keyof LSaveOptional])) {
              delete li[prop as keyof LSaveOptional]
            }
          } else {
            delete li[prop as keyof LSaveNever]
          }
        }
        break
      }
      case isR(ni.path): {
        const ri = ni as R
        for (const prop in ri) {
          if (rSaveOptional.hasOwnProperty(prop)) {
            if (isEqual(ri[prop as keyof RSaveOptional], rSaveOptional[prop as keyof RSaveOptional])) {
              delete ri[prop as keyof RSaveOptional]
            }
          } else {
            delete ri[prop as keyof RSaveNever]
          }
        }
        break
      }
      case isS(ni.path): {
        const si = ni as S
        for (const prop in si) {
          if (sSaveOptional.hasOwnProperty(prop)) {
            if (isEqual(si[prop as keyof SSaveOptional], sSaveOptional[prop as keyof SSaveOptional])) {
              delete si[prop as keyof SSaveOptional]
            }
          } else {
            delete si[prop as keyof SSaveNever]
          }
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        for (const prop in ci) {
          if (cSaveOptional.hasOwnProperty(prop)) {
            if (isEqual(ci[prop as keyof CSaveOptional], cSaveOptional[prop as keyof CSaveOptional])) {
              delete ci[prop as keyof CSaveOptional]
            }
          } else {
            delete ci[prop as keyof CSaveNever]
          }
        }
        break
      }
    }
  })
  return mPartial as MPartial
}
