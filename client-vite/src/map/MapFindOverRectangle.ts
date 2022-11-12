// @ts-nocheck

import { copy } from '../core/Utils'

let startX, startY, width, height = 0

export const mapFindOverRectangle = {
  start: (cr, x, y, w, h) => {
    startX = x
    startY = y
    width = w
    height = h
    let collection = []
    mapFindOverRectangle.iterate(cr, collection)
    return collection
  },

  iterate: (cm, collection) => {
    if (cm.type === 'struct' && !cm.hasCell && cm.content !== '') {
      if ( + rectanglesIntersect(
        startX, startY, startX + width, startY + height,
        cm.nodeStartX, cm.nodeY, cm.nodeEndX, cm.nodeY
      )) {
        collection.push(copy(cm.path))
      }
    }
    cm.d.map(i => mapFindOverRectangle.iterate(i, collection))
    cm.s.map(i => mapFindOverRectangle.iterate(i, collection))
    cm.c.map(i => i.map(j => mapFindOverRectangle.iterate(j, collection)))
  }
}

const rectanglesIntersect = (
  minAx, minAy, maxAx, maxAy,
  minBx, minBy, maxBx, maxBy) => {
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
