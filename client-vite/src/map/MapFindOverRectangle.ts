import {M, N} from "../types/DefaultProps"
import { copy } from '../core/Utils'

let startX = 0
let startY = 0
let width = 0
let height = 0

const rectanglesIntersect = (
  minAx: number, minAy: number, maxAx: number, maxAy: number,
  minBx: number, minBy: number, maxBx: number, maxBy: number
) => {
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}

export const mapFindOverRectangle = {
  find: (m: M, fromX: number, fromY: number, toX: number, toY: number) => {
    const startX = fromX < toX ? fromX : toX
    const startY = fromY < toY ? fromY : toY
    const width = Math.abs(toX - fromX)
    const height = Math.abs(toY - fromY)
    const selectionRect = [startX, startY, width, height]
    const highlightTargetPathList = mapFindOverRectangle.start(m, startX, startY, width, height)
    return { highlightTargetPathList, selectionRect }
  },

  start: (m: M, x: number, y: number, w: number, h: number) => {
    startX = x
    startY = y
    width = w
    height = h
    const collection = [] as any[]
    mapFindOverRectangle.iterate(m.r[0], collection)
    return collection
  },

  iterate: (cn: N, collection: any[]) => {
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
