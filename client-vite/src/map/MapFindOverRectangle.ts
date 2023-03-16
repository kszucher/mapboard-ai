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
    const highlightTargetPathList = mapFindOverRectangle.start(m, startX, startY, width, height)
    return { highlightTargetPathList }
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

  iterate: (n: N, collection: any[]) => {
    if (n.type === 'struct' && !n.hasCell && n.content !== '') {
      if ( + rectanglesIntersect(
        startX, startY, startX + width, startY + height,
        n.nodeStartX, n.nodeY, n.nodeEndX, n.nodeY
      )) {
        collection.push(copy(n.path))
      }
    }
    n.d.map(i => mapFindOverRectangle.iterate(i, collection))
    n.s.map(i => mapFindOverRectangle.iterate(i, collection))
    n.c.map(i => i.map(j => mapFindOverRectangle.iterate(j, collection)))
  }
}
