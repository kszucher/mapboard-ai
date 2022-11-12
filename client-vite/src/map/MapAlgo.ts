// @ts-nocheck

import {getDefaultNode} from "../core/DefaultProps"
import { mapref } from '../core/MapFlow'

let selectionFound = 0

export const mapAlgo = {
  start: (m, cr) => {
    mapAlgo.iterate(m, cr)
    if (!selectionFound) {
      cr.selected = 1
      console.log('MAP RESTORED AFTER NO SELECTION')
    }
  },

  iterate: (m, cm) => {
    if (cm.selected) {
      selectionFound = 1
    }
    if (cm.type === 'cell' && !cm.s.length) {
      cm.s.push(getDefaultNode({}))
    }
    if (cm.contentCalc && cm.contentCalc !== '') {
      if (cm.parentType === 'cell') {
        let parentStruct = mapref(m, mapref(m, cm.parentPath).parentPath)
        let result = 0
        for (let i = 0; i < parentStruct.c.length - 1; i++) {
          let currRowCell = parentStruct.c[0][i].s[0].content
          let currColCell = parentStruct.c[i][0].s[0].content
          if (cm.contentCalc === '=SUM') {
            result += parseInt(currColCell)
          }
        }
        cm.content = result

      } else {
        cm.content = 'not a last row of a table!'
      }
    }
    if (cm.d) cm.d.map(i => mapAlgo.iterate(m, i))
    if (cm.s) cm.s.map(i => mapAlgo.iterate(m, i))
    if (cm.c) cm.c.map(i => i.map(j => mapAlgo.iterate(m, j)))
  }
}
