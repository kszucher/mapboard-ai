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

  iterate: (cn: N) => {
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
