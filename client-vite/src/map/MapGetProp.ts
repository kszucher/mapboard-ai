import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

let propValue: any = undefined

export const mapGetProp = {
  start: (m: M, n: N, propKey: keyof N) => {
    propValue = n[propKey]
    mapGetProp.iterate(m, n, propKey)
    return propValue
  },

  iterate: (m: M, n: N, propKey: keyof N) => {
    let sCount = Object.keys(n.s).length
    if (sCount) {
      for (let i = 0; i < sCount; i++) {
        mapGetProp.iterate(m, n.s[i], propKey)
        if (n.s[i][propKey] !== propValue) {
          propValue = undefined
        }
      }
    }
    n.c.map(i => i.map(j => mapGetProp.iterate(m, j, propKey)))
  }
}
