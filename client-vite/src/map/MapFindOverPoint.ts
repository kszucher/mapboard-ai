import {M, N} from "../types/DefaultProps"
import {copy} from "../core/Utils"

let currX = 0
let currY = 0
let lastOverPath = [] as any[]

export const mapFindOverPoint = {
  start: (m: M, x: number, y: number) => {
    currX = x
    currY = y
    lastOverPath = []
    mapFindOverPoint.iterate(m.r[0])
    if (lastOverPath.length === 4) {
      lastOverPath = ['r', 0]
    }
    return lastOverPath
  },

  iterate: (n: N) => {
    if (n.nodeStartX < currX &&
      currX < n.nodeEndX &&
      n.nodeY - n.selfH / 2 < currY &&
      currY < n.nodeY + n.selfH  / 2 ) {
      if (n.index.length !== 2) {
        lastOverPath = copy(n.path)
      }
    }
    n.d.map(i => mapFindOverPoint.iterate(i))
    n.s.map(i => mapFindOverPoint.iterate(i))
    n.c.map(i => i.map(j => mapFindOverPoint.iterate(j)))
  }
}
