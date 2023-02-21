import {gSaveAlways, gSaveOptional, gSaveNever, nSaveAlways, nSaveOptional, nSaveNever} from '../core/DefaultProps'
import {GSaveNever, GSaveOptional, NSaveAlways, NSaveOptional, NSaveNever, NPartial, M, MPartial} from "../types/DefaultProps"
import { copy, genHash, shallowCopy } from '../core/Utils'

export const mapInit = {
  start: (m: MPartial) => {
    for (const prop in gSaveAlways) {
      // do nothing
    }
    for (const prop in gSaveOptional) {
      if (!m.g.hasOwnProperty(prop)) {
        m.g[prop as keyof GSaveOptional] = copy(gSaveOptional[prop as keyof GSaveOptional])
      }
    }
    for (const prop in gSaveNever) {
      m.g[prop as keyof GSaveNever] = copy(gSaveNever[prop as keyof GSaveNever])
    }
    // 30 = 14 + 2*8, 20 = 14 + 2*3
    m.g.sLineDeltaXDefault = m.g.density === 'large' ? 30 : 20
    m.g.padding = m.g.density === 'large' ? 8 : 3
    m.g.defaultH = m.g.density === 'large' ? 30 : 20
    m.g.taskConfigD = m.g.density === 'large' ? 24 : 20
    m.g.taskConfigWidth =
      (m.g.taskConfigN || gSaveNever.taskConfigWidth) * m.g.taskConfigD +
      ((m.g.taskConfigN || gSaveNever.taskConfigWidth) - 1) * (m.g.taskConfigGap || gSaveOptional.taskConfigGap)
    mapInit.iterate(m as M, m.r[0])
  },

  iterate: (m: M, cn: NPartial) => {
    for (const prop in nSaveAlways) {
      if (!cn.hasOwnProperty(prop)) {
        if (prop === 'nodeId') {
          cn[prop] = 'node' + genHash(8)
        } else {
          cn[prop as keyof NSaveAlways] = copy(nSaveAlways[prop as keyof NSaveAlways])
        }
      }
    }
    for (const prop in nSaveOptional) {
      if (!cn.hasOwnProperty(prop)) {
        cn[prop as keyof NSaveOptional] = shallowCopy(nSaveOptional[prop as keyof NSaveOptional])
      }
    }
    for (const prop in nSaveNever) {
      cn[prop as keyof NSaveNever] = shallowCopy(nSaveNever[prop as keyof NSaveNever])
    }
    cn.d.map((i) => mapInit.iterate(m, i))
    cn.s.map((i) => mapInit.iterate(m, i))
    cn.c.map((i) => i.map(j => mapInit.iterate(m, j)))
  }
}
