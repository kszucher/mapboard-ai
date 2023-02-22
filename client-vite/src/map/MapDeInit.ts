import {gSaveAlways, gSaveOptional, nSaveAlways, nSaveOptional} from "../core/DefaultProps"
import {GSaveOptional, GSaveNever, NSaveOptional, NSaveNever, N, M} from "../types/DefaultProps"

export const mapDeInit = {
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
    mapDeInit.iterate(m.r[0])
    return m
  },

  iterate: (n: N) => {
    n.d.map(i => mapDeInit.iterate(i))
    n.s.map(i => mapDeInit.iterate(i))
    n.c.map(i => i.map(j => mapDeInit.iterate(j)))
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
