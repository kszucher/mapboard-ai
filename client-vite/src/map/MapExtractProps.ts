import {M, N, NSaveOptional} from "../types/DefaultProps"
import {getMapData} from "../core/MapFlow"
import {mapGetProp} from "./MapGetProp"

export const mapExtractProps = {
  start: (m: M) => {
    if (m.g.sc.lastPath.length) {
      const ln = getMapData(m, m.g.sc.lastPath)
      for (const prop of Object.keys(m.g.nc)) {
        const sourceProp = {
          selection: 'selection',
          lineWidth: 'lineWidth',
          lineType: 'lineType',
          lineColor: 'lineColor',
          borderWidth: ln.selection === 's' ? 'sBorderWidth' : 'fBorderWidth',
          borderColor: ln.selection === 's' ? 'sBorderColor' : 'fBorderColor',
          fillColor: ln.selection === 's' ? 'sFillColor' : 'fFillColor',
          textFontSize: 'textFontSize',
          textColor: 'textColor',
          taskStatus: 'taskStatus'
        }[prop] as keyof NSaveOptional
        if (m.g.sc.structSelectedPathList.map(el => (getMapData(m, el))[sourceProp]).every((el, i, arr) => el  === arr[0])) {
          let propAssignment = {}
          switch (prop) {
            case 'selection': propAssignment = ln.selection; break
            case 'lineWidth': propAssignment = ln.selection === 's' ? ln[prop] : mapGetProp.start(m, ln, prop); break
            case 'lineType': propAssignment = ln.selection === 's' ? ln[prop] : mapGetProp.start(m, ln, prop); break
            case 'lineColor': propAssignment = ln.selection === 's' ? ln[prop] : mapGetProp.start(m, ln, prop); break
            case 'borderWidth': propAssignment = ln.selection === 's' ? ln.sBorderWidth : ln.fBorderWidth; break
            case 'borderColor': propAssignment = ln.selection === 's' ? ln.sBorderColor : ln.fBorderColor; break
            case 'fillColor': propAssignment = ln.selection === 's' ? ln.sFillColor : ln.fFillColor; break
            case 'textFontSize': propAssignment = ln.selection === 's' ? ln[prop] : mapGetProp.start(m, ln, prop); break
            case 'textColor': propAssignment = ln.selection === 's'? ln[prop] : mapGetProp.start(m, ln, prop); break
            case 'taskStatus': propAssignment = ln.selection === 's'? ln[prop]: undefined; break
          }
          Object.assign(m.g.nc, {[prop]: propAssignment})
        }
      }
    }
    m.g.taskLeft = 0
    m.g.taskRight = 0
    mapExtractProps.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    if (n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4) {
      try {
        if (n.path[3] === 0) {
          m.g.taskRight = 1
        } else {
          m.g.taskLeft = 1
        }
      } catch {
        console.log(n.path)
      }
    }
    n.d.map(i => mapExtractProps.iterate(m, i))
    n.s.map(i => mapExtractProps.iterate(m, i))
    n.c.map(i => i.map(j => mapExtractProps.iterate(m, j)))
  }
}
