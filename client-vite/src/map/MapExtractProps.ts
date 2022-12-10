// @ts-nocheck

import {getMapData} from "../core/MapFlow";
import {mapGetProp} from "./MapGetProp";

export const mapExtractProps = {
  start: (m, cr) => {
    if (m.sc.lastPath.length) {
      const ln = getMapData(m, m.sc.lastPath)
      for (const prop of Object.keys(m.nc)) {
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
        }[prop]
        if (m.sc.structSelectedPathList.map(el => (getMapData(m, el))[sourceProp]).every((el, i, arr) => el  === arr[0])) {
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
          Object.assign(m.nc, {[prop]: propAssignment})
        }
      }
    }
    m.taskLeft = 0
    m.taskRight = 0
    mapExtractProps.iterate(m, cr)
  },

  iterate: (m, cn) => {
    if (cn.animationRequested) {
      m.animationRequested = 1
    }
    if (cn.taskStatus !== -1 && !cn.path.includes('c') && cn.path.length > 4) {
      try {
        if (cn.path[3] === 0) {
          m.taskRight = 1
        } else {
          m.taskLeft = 1
        }
      } catch {
        console.log(cn.path)
      }
    }
    cn.d.map(i => mapExtractProps.iterate(m, i))
    cn.s.map(i => mapExtractProps.iterate(m, i))
    cn.c.map(i => i.map(j => mapExtractProps.iterate(m, j)))
  }
}
