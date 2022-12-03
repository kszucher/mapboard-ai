// @ts-nocheck

import {getMapData} from "../core/MapFlow";
import {mapGetProp} from "./MapGetProp";

export const mapExtractFormatting = {
  start: (m) => {
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
  }
}
