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

  iterate: (cn: N) => {
    cn.d.map(i => mapDeInit.iterate(i))
    cn.s.map(i => mapDeInit.iterate(i))
    cn.c.map(i => i.map(j => mapDeInit.iterate(j)))
    for (const prop in cn) {
      if (nSaveAlways.hasOwnProperty(prop)) {
        // do nothing
      } else if (nSaveOptional.hasOwnProperty(prop)) {
        if (cn[prop as keyof NSaveOptional] === nSaveOptional[prop as keyof NSaveOptional]) {
          delete cn[prop as keyof NSaveOptional]
        }
      } else {
        delete cn[prop as keyof NSaveNever]
      }
    }
  }
}
