// @ts-nocheck

export const mapGetProp = {
  start: (m, cn, prop) => {
    let firstProp = {[prop]: cn[prop]}
    mapGetProp.iterate(m, cn, prop, firstProp)
    return firstProp[prop]
  },

  iterate: (m, cn, prop, firstProp) => {
    let sCount = Object.keys(cn.s).length
    if (sCount) {
      for (let i = 0; i < sCount; i++) {
        mapGetProp.iterate(m, cn.s[i], prop, firstProp)
        if (cn.s[i][prop] !== firstProp[prop]) {
          firstProp[prop] = undefined
        }
      }
    }
    cn.c.map(i => i.map(j => mapGetProp.iterate(m, j, prop, firstProp)))
  }
}
