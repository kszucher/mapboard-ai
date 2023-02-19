import {getMapData} from "../core/MapFlow";

export const mapDiff = {
  start: (pm: any, m: any) => {
    mapDiff.iterate(pm, m, m.r[0])
  },

  iterate: (pm: any, m: any, cn: any) => {
    const pn = getMapData(pm, cn.path)
    if (cn.nodeId === pn?.nodeId) {
      if (pn.content !== cn.content || pn.contentType !== cn.contentType || pn.textFontSize !== cn.textFontSize) {
        cn.dimChange = 1
      }
      if (cn.s.length !== pn.s?.length) {
        for (let i = 0; i < cn.s.length; i++) {
          cn.s[i].parentNodeEndXFrom = pn.nodeEndX
          cn.s[i].parentNodeStartXFrom = pn.nodeStartX
          cn.s[i].parentNodeYFrom = pn.nodeY
          cn.s[i].animationRequested = 1
        }
      }
    }
    cn.d.map((i: any) => mapDiff.iterate(pm, m, i))
    cn.s.map((i: any) => mapDiff.iterate(pm, m, i))
    cn.c.map((i: any[]) => i.map(j => mapDiff.iterate(pm, m, j)))
  }
}
