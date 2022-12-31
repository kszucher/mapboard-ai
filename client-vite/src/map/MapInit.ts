import { nodeProps, mapProps } from '../core/DefaultProps'
import { copy, genHash, shallowCopy } from '../core/Utils'

export const mapInit = {
  start: (m: any) => {
    // note: no need for saveAlways, as these values should always be pre-made by the server
    for (const prop in mapProps.saveOptional) {
      if (!m.g.hasOwnProperty(prop)) {
        // @ts-ignore
        m.g[prop] = copy(mapProps.saveOptional[prop])
      }
    }
    for (const prop in mapProps.saveNeverInitAlways) {
      // @ts-ignore
      m.g[prop] = copy(mapProps.saveNeverInitAlways[prop])
    }
    m.g.sLineDeltaXDefault = m.g.density === 'large' ? 30 : 20
    m.g.padding = m.g.density === 'large' ? 8 : 3
    m.g.defaultH = m.g.density === 'large' ? 30 : 20 // 30 = 14 + 2*8, 20 = 14 + 2*3
    m.g.taskConfigD = m.g.density === 'large' ? 24 : 20
    m.g.taskConfigWidth = m.g.taskConfigN * m.g.taskConfigD + (m.g.taskConfigN - 1) * m.g.taskConfigGap
    mapInit.iterate(m, m.r[0])
  },

  iterate: (m: any, cn: any) => {
    for (const prop in nodeProps.saveAlways) {
      if (!cn.hasOwnProperty(prop)) {
        if (prop === 'nodeId') {
          cn[prop] = 'node' + genHash(8)
        } else {
          // @ts-ignore
          cn[prop] = copy(nodeProps.saveAlways[prop])
        }
      }
    }
    for (const prop in nodeProps.saveOptional) {
      if (!cn.hasOwnProperty(prop)) {
        // @ts-ignore
        cn[prop] = shallowCopy(nodeProps.saveOptional[prop])
      }
    }
    for (const prop in nodeProps.saveNeverInitAlways) {
      // @ts-ignore
      cn[prop] = shallowCopy(nodeProps.saveNeverInitAlways[prop])
    }
    cn.d.map((i: any) => mapInit.iterate(m, i))
    cn.s.map((i: any) => mapInit.iterate(m, i))
    cn.c.map((i: any[]) => i.map(j => mapInit.iterate(m, j)))
  }
}
