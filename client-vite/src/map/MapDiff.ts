import {M, N} from "../types/DefaultProps"
import {getMapData} from "../core/MapFlow"

export const mapDiff = {
  start: (pm: M, m: M) => {
    mapDiff.iterate(pm, m, m.r[0])
  },

  iterate: (pm: M, m: M, n: N) => {
    const pn = getMapData(pm, n.path)
    if (n.nodeId === pn?.nodeId) {
      if (pn.content !== n.content || pn.contentType !== n.contentType || pn.textFontSize !== n.textFontSize) {
        n.dimChange = 1
      }
      if (n.s.length !== pn.s?.length) {
        for (let i = 0; i < n.s.length; i++) {
          n.s[i].parentNodeEndXFrom = pn.nodeEndX
          n.s[i].parentNodeStartXFrom = pn.nodeStartX
          n.s[i].parentNodeYFrom = pn.nodeY
          n.s[i].animationRequested = 1
        }
      }
    }
    n.d.map(i => mapDiff.iterate(pm, m, i))
    n.s.map(i => mapDiff.iterate(pm, m, i))
    n.c.map(i => i.map(j => mapDiff.iterate(pm, m, j)))
  }
}
