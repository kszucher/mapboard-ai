// @ts-nocheck

import {getDefaultNode} from "../core/DefaultProps"
import { getMapData } from '../core/MapFlow'

let selectionFound = 0

export const mapAlgo = {
  start: (m, cr) => {
    mapAlgo.iterate(m, cr)
    if (!selectionFound) {
      cr.selected = 1
      console.log('MAP RESTORED AFTER NO SELECTION')
    }
  },

  iterate: (m, cn) => {
    if (cn.selected) {
      selectionFound = 1
    }
    if (cn.type === 'cell' && !cn.s.length) {
      cn.s.push(getDefaultNode({}))
    }
    if (cn.d) cn.d.map(i => mapAlgo.iterate(m, i))
    if (cn.s) cn.s.map(i => mapAlgo.iterate(m, i))
    if (cn.c) cn.c.map(i => i.map(j => mapAlgo.iterate(m, j)))
  }
}
