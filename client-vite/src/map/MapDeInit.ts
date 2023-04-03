import {M, GNPartial} from "../state/MTypes"
import {GSaveOptional, GSaveNever} from "../state/GPropsTypes"
import {NSaveOptional, NSaveNever} from "../state/NPropsTypes"
import {gSaveAlways, gSaveOptional} from "../state/GProps"
import {nSaveAlways, nSaveOptional} from "../state/NProps"
import {copy} from "../core/Utils";
import {isG} from "../core/MapUtils";

export const mapDeInit = (m: M) => {
  const mlRemoved = copy(m).sort((a:GNPartial, b: GNPartial) => (a.path.join('') > b.path.join('')) ? 1 : -1)
  for (const nl of mlRemoved) {
    if (isG(nl.path)) {
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
