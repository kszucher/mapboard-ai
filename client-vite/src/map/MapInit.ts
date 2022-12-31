import { nodeProps, mapProps } from '../core/DefaultProps'
import { copy, genHash, shallowCopy } from '../core/Utils'

export const mapInit = {
  start: (m: any) => {
    // note: no need for saveAlways, as these values should always be pre-made by the server
    for (const prop in mapProps.saveOptional) {
      if (!m.hasOwnProperty(prop)) {
        // @ts-ignore
        m[prop] = copy(mapProps.saveOptional[prop])
      }
    }
    for (const prop in mapProps.saveNeverInitAlways) {
      // @ts-ignore
      m[prop] = copy(mapProps.saveNeverInitAlways[prop])
    }
    m.sLineDeltaXDefault = m.density === 'large' ? 30 : 20
    m.padding = m.density === 'large' ? 8 : 3
    m.defaultH = m.density === 'large' ? 30 : 20 // 30 = 14 + 2*8, 20 = 14 + 2*3
    m.taskConfigD = m.density === 'large' ? 24 : 20
    m.taskConfigWidth = m.taskConfigN * m.taskConfigD + (m.taskConfigN - 1) * m.taskConfigGap
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
