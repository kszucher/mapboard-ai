// @ts-nocheck

import { copy } from '../core/Utils'
import {getMapData} from "../core/MapFlow";

let startX, startY, width, height = 0

export const mapFindOverRectangle = {
  find: (m, fromX, fromY, toX, toY) => {
    let startX = fromX < toX ? fromX : toX
    let startY = fromY < toY ? fromY : toY
    let width = Math.abs(toX - fromX)
    let height = Math.abs(toY - fromY)
    let selectionRect = [startX, startY, width, height]
    const highlightTargetPathList = mapFindOverRectangle.start(getMapData(m, ['r', 0]), startX, startY, width, height)
    return { highlightTargetPathList, selectionRect }
  },

  start: (cr, x, y, w, h) => {
    startX = x
    startY = y
    width = w
    height = h
    let collection = []
    mapFindOverRectangle.iterate(cr, collection)
    return collection
  },

  iterate: (cn, collection) => {
    if (cn.type === 'struct' && !cn.hasCell && cn.content !== '') {
      if ( + rectanglesIntersect(
        startX, startY, startX + width, startY + height,
        cn.nodeStartX, cn.nodeY, cn.nodeEndX, cn.nodeY
      )) {
        collection.push(copy(cn.path))
      }
    }
    cn.d.map(i => mapFindOverRectangle.iterate(i, collection))
    cn.s.map(i => mapFindOverRectangle.iterate(i, collection))
    cn.c.map(i => i.map(j => mapFindOverRectangle.iterate(j, collection)))
  }
}

const rectanglesIntersect = (
  minAx, minAy, maxAx, maxAy,
  minBx, minBy, maxBx, maxBy) => {
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}
