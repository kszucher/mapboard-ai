import isEqual from "react-fast-compare"
import {M, GSaveNever, GSaveOptional, TSaveNever, TSaveOptional, LSaveOptional, LSaveNever} from "../state/MapStateTypes"
import {gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, tSaveAlways, tSaveOptional} from "../state/MapState"
import {mG, mL, mT, sortPath} from "../selectors/MapSelector"

export const mapDeInit = (m: M) => {
  const mlRemoved = structuredClone(m).sort(sortPath)
  mG(mlRemoved as M).forEach(g => {
    for (const prop in g) {
      if (gSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (gSaveOptional.hasOwnProperty(prop)) {
        if (isEqual(g[prop as keyof GSaveOptional], gSaveOptional[prop as keyof GSaveOptional])) {
          delete g[prop as keyof GSaveOptional]
        }
      } else {
        delete g[prop as keyof GSaveNever]
      }
    }
  })
  mL(mlRemoved as M).forEach(li => {
    for (const prop in li) {
      if (lSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (lSaveOptional.hasOwnProperty(prop)) {
        if (isEqual(li[prop as keyof LSaveOptional], lSaveOptional[prop as keyof LSaveOptional])) {
          delete li[prop as keyof LSaveOptional]
        }
      } else {
        delete li[prop as keyof LSaveNever]
      }
    }
  })
  mT(mlRemoved as M).forEach(ti => {
    for (const prop in ti) {
      if (tSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (tSaveOptional.hasOwnProperty(prop)) {
        if (isEqual(ti[prop as keyof TSaveOptional], tSaveOptional[prop as keyof TSaveOptional])) {
          delete ti[prop as keyof TSaveOptional]
        }
      } else {
        delete ti[prop as keyof TSaveNever]
      }
    }
  })
  return mlRemoved
}
