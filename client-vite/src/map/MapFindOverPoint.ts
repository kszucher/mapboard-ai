// @ts-nocheck

import {copy} from "../core/Utils"

let currX, currY = 0
let lastOverPath = []

export const mapFindOverPoint = {
  start: (m, x, y) => {
    currX = x
    currY = y
    lastOverPath = []
    mapFindOverPoint.iterate(m.r[0])
    if (lastOverPath.length === 4) {
      lastOverPath = ['r', 0]
    }
    return lastOverPath
  },

  iterate: (cn) => {
    if (cn.nodeStartX < currX &&
      currX < cn.nodeEndX &&
      cn.nodeY - cn.selfH / 2 < currY &&
      currY < cn.nodeY + cn.selfH  / 2 ) {
      if (cn.index.length !== 2) {
        lastOverPath = copy(cn.path)
      }
    }
    cn.d.map(i => mapFindOverPoint.iterate(i))
    cn.s.map(i => mapFindOverPoint.iterate(i))
    cn.c.map(i => i.map(j => mapFindOverPoint.iterate(j)))
  }
}
