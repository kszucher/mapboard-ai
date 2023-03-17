import {M, N} from "../types/DefaultProps"
import {copy, isEqual} from "../core/Utils"
import {getMapData} from "../core/MapFlow"

let currX = 0
let currY = 0
let aboveRoot = false
let belowRoot = false
let lastNearestPath = [] as any[]

export const mapFindNearest = {
  find: (m: M, toX: number, toY: number) => {
    let moveTargetPath = []
    let moveTargetIndex = 0
    let moveCoords = [] as any[]
    let lastSelectedPath = m.g.sc.structSelectedPathList[0]
    let lastSelected = getMapData(m, lastSelectedPath)
    if (!(lastSelected.nodeStartX < toX &&
      toX < lastSelected.nodeEndX &&
      lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
      toY < lastSelected.nodeY + lastSelected.selfH / 2)) {
      let lastNearestPath = mapFindNearest.start(m, toX, toY)
      if (lastNearestPath.length > 2) {
        moveTargetPath = copy(lastNearestPath)
        let lastFound = getMapData(m, lastNearestPath)
        let fromX = lastFound.path[3] ? lastFound.nodeStartX : lastFound.nodeEndX
        let fromY = lastFound.nodeY
        moveCoords = [fromX, fromY, toX, toY]
        if (lastFound.s.length === 0) {
          moveTargetIndex = 0
        } else {
          let insertIndex = 0
          for (let i = 0; i < lastFound.s.length - 1; i++) {
            if (toY > lastFound.s[i].nodeY && toY <= lastFound.s[i + 1].nodeY) {
              insertIndex = i + 1
            }
          }
          if (toY > lastFound.s[lastFound.s.length - 1].nodeY) {
            insertIndex = lastFound.s.length
          }
          let lastSelectedParentPath = lastSelected.parentPath
          if (isEqual(lastFound.path, lastSelectedParentPath)) {
            if (lastSelected.index < insertIndex) {
              insertIndex -= 1
            }
          }
          moveTargetIndex = insertIndex
        }
      }
    }
    if (isEqual(lastSelected.parentPath, moveTargetPath) && lastSelected.index === moveTargetIndex) {
      moveTargetPath = []
      moveTargetIndex = 0
      moveCoords = []
    }
    return { moveCoords, moveTargetPath, moveTargetIndex }
  },

  start: (m: M, x: number, y: number) => {
    currX = x
    currY = y
    aboveRoot = y >= m.r[0].nodeY
    belowRoot = y < m.r[0].nodeY
    lastNearestPath = []
    mapFindNearest.iterate(m.r[0])
    return lastNearestPath
  },

  iterate: (n: N) => {
    if (!n.selected) {
      n.d.map(i => mapFindNearest.iterate(i))
      if (n.type === 'cell') {
        n.s.map(i => mapFindNearest.iterate(i))
      } else {
        let overlap = 6
        let vCondition
        if (n.isTop && belowRoot) {
          vCondition = currY < (n.nodeY + n.maxH / 2 + overlap)
        } else if (n.isBottom && aboveRoot) {
          vCondition = currY > (n.nodeY - n.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(currY - n.nodeY) <= n.maxH / 2 + overlap
        }
        let hCondition =
          (n.path[3] === 0 && currX > n.nodeEndX) ||
          (n.path[3] === 1 && currX < n.nodeStartX)
        if (vCondition && hCondition ) {
          lastNearestPath = copy(n.path)
          n.s.map(i => mapFindNearest.iterate(i))
        }
      }
      n.c.map(i => i.map(j => mapFindNearest.iterate(j)))
    }
  }
}
