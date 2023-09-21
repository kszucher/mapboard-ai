import isEqual from "react-fast-compare"
import {M, GSaveNever, GSaveOptional, NSaveNever, NSaveOptional, LSaveOptional, LSaveNever} from "../state/MapStateTypes"
import {gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, nSaveAlways, nSaveOptional} from "../state/MapState"
import {isG, isL, sortPath} from "../selectors/MapSelector"

export const mapDeInit = (m: M) => {
  const mlRemoved = structuredClone(m).sort(sortPath)
  for (const nl of mlRemoved) {
    if (isG(nl.path)) {
      for (const prop in nl) {
        if (gSaveAlways.hasOwnProperty(prop)) {
          // do nothing
        } else if (gSaveOptional.hasOwnProperty(prop)) {
          if (isEqual(nl[prop as keyof GSaveOptional], gSaveOptional[prop as keyof GSaveOptional])) {
            delete nl[prop as keyof GSaveOptional]
          }
        } else {
          delete nl[prop as keyof GSaveNever]
        }
      }
    } else if (isL(nl.path)) {
      for (const prop in nl) {
        if (lSaveAlways.hasOwnProperty(prop)) {
          // do nothing
        } else if (lSaveOptional.hasOwnProperty(prop)) {
          if (isEqual(nl[prop as keyof LSaveOptional], lSaveOptional[prop as keyof LSaveOptional])) {
            delete nl[prop as keyof LSaveOptional]
          }
        } else {
          delete nl[prop as keyof LSaveNever]
        }
      }
    } else {
      for (const prop in nl) {
        if (nSaveAlways.hasOwnProperty(prop)) {
          // do nothing
        } else if (nSaveOptional.hasOwnProperty(prop)) {
          if (isEqual(nl[prop as keyof NSaveOptional], nSaveOptional[prop as keyof NSaveOptional])) {
            delete nl[prop as keyof NSaveOptional]
          }
        } else {
          delete nl[prop as keyof NSaveNever]
        }
      }
    }
  }
  return mlRemoved
}
