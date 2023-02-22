import {M, N} from "../types/DefaultProps"

let propValue: string | number | any[] | undefined = undefined

export const mapGetProp = {
  start: (m: M, cn: N, propKey: keyof N) => {
    propValue = cn[propKey]
    mapGetProp.iterate(m, cn, propKey)
    return propValue
  },

  iterate: (m: M, cn: N, propKey: keyof N) => {
    let sCount = Object.keys(cn.s).length
    if (sCount) {
      for (let i = 0; i < sCount; i++) {
        mapGetProp.iterate(m, cn.s[i], propKey)
        if (cn.s[i][propKey] !== propValue) {
          propValue = undefined
        }
      }
    }
    cn.c.map(i => i.map(j => mapGetProp.iterate(m, j, propKey)))
  }
}
