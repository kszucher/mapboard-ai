import {M, ML, MLPartial, NLPartial} from "../state/MTypes"
import {GSaveOptional, GSaveNever, G} from "../state/GPropsTypes"
import {NSaveOptional, NSaveNever, N} from "../state/NPropsTypes"
import {gSaveAlways, gSaveOptional} from "../state/GProps"
import {nSaveAlways, nSaveOptional} from "../state/NProps"
import {copy} from "../core/Utils";

export const mapRemoveHelperProps = (ml: ML) => {
  const mlRemoved = copy(ml)
  for (const nl of mlRemoved) {
    if (nl.path.length === 1) {
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
  return mlRemoved.sort((a:NLPartial, b: NLPartial) => (a.path.join('') > b.path.join('')) ? 1 : -1)
}

export const mapDeInitNested = {
  start: (m: M) => {
    for (const prop in m.g) {
      if (gSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (gSaveOptional.hasOwnProperty(prop)) {
        if (m.g[prop as keyof GSaveOptional] === gSaveOptional[prop as keyof GSaveOptional]) {
          delete m.g[prop as keyof GSaveOptional]
        }
      } else {
        delete m.g[prop as keyof GSaveNever]
      }
    }
    mapDeInitNested.iterate(m.r[0])
    return m
  },

  iterate: (n: N) => {
    n.d?.map(i => mapDeInitNested.iterate(i))
    n.s?.map(i => mapDeInitNested.iterate(i))
    n.c?.map(i => i.map(j => mapDeInitNested.iterate(j)))
    for (const prop in n) {
      if (nSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (nSaveOptional.hasOwnProperty(prop)) {
        if (n[prop as keyof NSaveOptional] === nSaveOptional[prop as keyof NSaveOptional]) {
          delete n[prop as keyof NSaveOptional]
        }
      } else {
        delete n[prop as keyof NSaveNever]
      }
    }
  }
}

// TODO make this work on LINEAR data!!!
