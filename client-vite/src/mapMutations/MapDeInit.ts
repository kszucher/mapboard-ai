import isEqual from "react-fast-compare"
import {M, GSaveNever, GSaveOptional, LSaveOptional, LSaveNever, G, L, R, RSaveOptional, RSaveNever, S, SSaveOptional, SSaveNever, C, CSaveOptional, CSaveNever, MPartial} from "../state/MapStateTypes"
import {cSaveAlways, cSaveOptional, gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, rSaveAlways, rSaveOptional, sSaveAlways, sSaveOptional} from "../state/MapState"
import {sortPath} from "./MapSort.ts"
import {isC, isG, isL, isR, isS} from "../mapQueries/PathQueries.ts";
import {mG, mL, mR, mS, mC} from "../mapQueries/MapQueries.ts"

export const mapDeInit = (m: M) => {
  // const mPartial = structuredClone(m).sort(sortPath)
  // mPartial.forEach(ni => {
  //   switch (true) {
  //     case isG(ni.path): {
  //       const g  = ni as G
  //       for (const prop in g) {
  //         if (gSaveAlways.hasOwnProperty(prop)) {
  //           // do nothing
  //         } else if (gSaveOptional.hasOwnProperty(prop)) {
  //           if (isEqual(g[prop as keyof GSaveOptional], gSaveOptional[prop as keyof GSaveOptional])) {
  //             delete g[prop as keyof GSaveOptional]
  //           }
  //         } else {
  //           delete g[prop as keyof GSaveNever]
  //         }
  //       }
  //       break
  //     }
  //     case isL(ni.path): {
  //       const li = ni as L
  //       for (const prop in li) {
  //         if (lSaveAlways.hasOwnProperty(prop)) {
  //           // do nothing
  //         } else if (lSaveOptional.hasOwnProperty(prop)) {
  //           if (isEqual(li[prop as keyof LSaveOptional], lSaveOptional[prop as keyof LSaveOptional])) {
  //             delete li[prop as keyof LSaveOptional]
  //           }
  //         } else {
  //           delete li[prop as keyof LSaveNever]
  //         }
  //       }
  //       break
  //     }
  //     case isR(ni.path): {
  //       const ri = ni as R
  //       for (const prop in ri) {
  //         if (rSaveAlways.hasOwnProperty(prop)) {
  //           // do nothing
  //         } else if (rSaveOptional.hasOwnProperty(prop)) {
  //           if (isEqual(ri[prop as keyof RSaveOptional], rSaveOptional[prop as keyof RSaveOptional])) {
  //             delete ri[prop as keyof RSaveOptional]
  //           }
  //         } else {
  //           delete ri[prop as keyof RSaveNever]
  //         }
  //       }
  //       break
  //     }
  //     case isS(ni.path): {
  //       const si = ni as S
  //       for (const prop in si) {
  //         if (sSaveAlways.hasOwnProperty(prop)) {
  //           // do nothing
  //         } else if (sSaveOptional.hasOwnProperty(prop)) {
  //           if (isEqual(si[prop as keyof SSaveOptional], sSaveOptional[prop as keyof SSaveOptional])) {
  //             delete si[prop as keyof SSaveOptional]
  //           }
  //         } else {
  //           delete si[prop as keyof SSaveNever]
  //         }
  //       }
  //       break
  //     }
  //     case isC(ni.path): {
  //       const ci = ni as C
  //       for (const prop in ci) {
  //         if (cSaveAlways.hasOwnProperty(prop)) {
  //           // do nothing
  //         } else if (cSaveOptional.hasOwnProperty(prop)) {
  //           if (isEqual(ci[prop as keyof CSaveOptional], cSaveOptional[prop as keyof CSaveOptional])) {
  //             delete ci[prop as keyof CSaveOptional]
  //           }
  //         } else {
  //           delete ci[prop as keyof CSaveNever]
  //         }
  //       }
  //       break
  //     }
  //   }
  // })

  const filterObject = (obj: object, keys: string[]) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
  const getNonDefaultObjectKeys = (obj: object, defaultObj: object) => Object.keys(obj).filter(key => obj[key as keyof typeof obj] !== defaultObj[key as keyof typeof defaultObj])

  const mPartial = ([
    ...mG(m).map(gi => ({...filterObject(gi, [...Object.keys(gSaveAlways), ...getNonDefaultObjectKeys(filterObject(gi, Object.keys(gSaveOptional)), gSaveOptional)])})),
    ...mL(m).map(li => ({...filterObject(li, [...Object.keys(lSaveAlways), ...getNonDefaultObjectKeys(filterObject(li, Object.keys(lSaveOptional)), lSaveOptional)])})),
    ...mR(m).map(ri => ({...filterObject(ri, [...Object.keys(rSaveAlways), ...getNonDefaultObjectKeys(filterObject(ri, Object.keys(rSaveOptional)), rSaveOptional)])})),
    ...mS(m).map(si => ({...filterObject(si, [...Object.keys(sSaveAlways), ...getNonDefaultObjectKeys(filterObject(si, Object.keys(sSaveOptional)), sSaveOptional)])})),
    ...mC(m).map(ci => ({...filterObject(ci, [...Object.keys(cSaveAlways), ...getNonDefaultObjectKeys(filterObject(ci, Object.keys(cSaveOptional)), cSaveOptional)])}))
  ] as M).sort(sortPath)

  return mPartial as MPartial
}
