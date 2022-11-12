// @ts-nocheck

import {getMapData} from "../core/MapFlow";
import {mapGetProp} from "./MapGetProp";

export const mapExtractFormatting = {
  start: (m) => {
    const lm = getMapData(m, m.sc.lastPath)
    for (const prop of Object.keys(m.nc)) {
      const sourceProp = {
        selection: 'selection',
        lineWidth: 'lineWidth',
        lineType: 'lineType',
        lineColor: 'lineColor',
        borderWidth: lm.selection === 's' ? 'sBorderWidth' : 'fBorderWidth',
        borderColor: lm.selection === 's' ? 'sBorderColor' : 'fBorderColor',
        fillColor: lm.selection === 's' ? 'sFillColor' : 'fFillColor',
        textFontSize: 'textFontSize',
        textColor: 'textColor',
        taskStatus: 'taskStatus'
      }[prop]
      if (m.sc.structSelectedPathList.map(el => (getMapData(m, el))[sourceProp]).every((el, i, arr) => el  === arr[0])) {
        let propAssignment = {}
        switch (prop) {
          case 'selection': propAssignment = lm.selection; break
          case 'lineWidth': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
          case 'lineType': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
          case 'lineColor': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
          case 'borderWidth': propAssignment = lm.selection === 's' ? lm.sBorderWidth : lm.fBorderWidth; break
          case 'borderColor': propAssignment = lm.selection === 's' ? lm.sBorderColor : lm.fBorderColor; break
          case 'fillColor': propAssignment = lm.selection === 's' ? lm.sFillColor : lm.fFillColor; break
          case 'textFontSize': propAssignment = lm.selection === 's' ? lm[prop] : mapGetProp.start(m, lm, prop); break
          case 'textColor': propAssignment = lm.selection === 's'? lm[prop] : mapGetProp.start(m, lm, prop); break
          case 'taskStatus': propAssignment = lm.selection === 's'? lm[prop]: undefined; break
        }
        Object.assign(m.nc, {[prop]: propAssignment})
      }
    }
  }
}
