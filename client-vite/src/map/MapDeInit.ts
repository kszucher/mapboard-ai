import {M, GSaveNever, GSaveOptional, NSaveNever, NSaveOptional} from "../state/MapPropTypes"
import {gSaveAlways, gSaveOptional, nSaveAlways, nSaveOptional} from "../state/MapProps"
import {is_G, sortPath} from "./MapUtils"

export const mapDeInit = (m: M) => {
  const mlRemoved = structuredClone(m).sort(sortPath)
  for (const nl of mlRemoved) {
    if (is_G(nl.path)) {
      for (const prop in nl) {
        if (gSaveAlways.hasOwnProperty(prop)) {
          // do nothing
        } else if (gSaveOptional.hasOwnProperty(prop)) {
          if (nl[prop as keyof GSaveOptional] === gSaveOptional[prop as keyof GSaveOptional]) {
            delete nl[prop as keyof GSaveOptional]
          }
        } else {
          delete nl[prop as keyof GSaveNever]
        }
      }
    } else {
      for (const prop in nl) {
        if (nSaveAlways.hasOwnProperty(prop)) {
          // do nothing
        } else if (nSaveOptional.hasOwnProperty(prop)) {
          if (nl[prop as keyof NSaveOptional] === nSaveOptional[prop as keyof NSaveOptional]) {
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
