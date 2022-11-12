export const mapGetProp = {
  start: (m, cm, prop) => {
    let firstProp = {[prop]: cm[prop]}
    mapGetProp.iterate(m, cm, prop, firstProp)
    return firstProp[prop]
  },

  iterate: (m, cm, prop, firstProp) => {
    let sCount = Object.keys(cm.s).length
    if (sCount) {
      for (let i = 0; i < sCount; i++) {
        mapGetProp.iterate(m, cm.s[i], prop, firstProp)
        if (cm.s[i][prop] !== firstProp[prop]) {
          firstProp[prop] = undefined
        }
      }
    }
    cm.c.map(i => i.map(j => mapGetProp.iterate(m, j, prop, firstProp)))
  }
}
