// @ts-nocheck

import {copy, isEqual} from "../core/Utils"
import {getMapData} from "../core/MapFlow";

let currX, currY = 0
let aboveRoot, belowRoot = 0
let lastNearestPath = []

export const mapFindNearest = {
  find: (m, toX, toY) => {
    let moveTargetPath = []
    let moveTargetIndex = 0
    let moveData = []
    let lastSelectedPath = m.sc.structSelectedPathList[0]
    let lastSelected = getMapData(m, lastSelectedPath)
    if (!(lastSelected.nodeStartX < toX &&
      toX < lastSelected.nodeEndX &&
      lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
      toY < lastSelected.nodeY + lastSelected.selfH / 2)) {
      let lastNearestPath = mapFindNearest.start(getMapData(m, ['r', 0]), toX, toY)
      if (lastNearestPath.length > 2) {
        moveTargetPath = copy(lastNearestPath)
        let lastFound = getMapData(m, lastNearestPath)
        let fromX = lastFound.path[3] ? lastFound.nodeStartX : lastFound.nodeEndX
        let fromY = lastFound.nodeY
        moveData = [fromX, fromY, toX, toY]
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
    return { moveTargetPath, moveTargetIndex, moveData }
  },

  start: (cr, x, y) => {
    currX = x
    currY = y
    aboveRoot = y >= cr.nodeY
    belowRoot = y < cr.nodeY
    lastNearestPath = []
    mapFindNearest.iterate(cr)
    return lastNearestPath
  },

  iterate: (cm) => {
    if (!cm.selected) {
      cm.d.map(i => mapFindNearest.iterate(i))
      if (cm.type === 'cell') {
        cm.s.map(i => mapFindNearest.iterate(i))
      } else {
        let overlap = 6
        let vCondition
        if (cm.isTop && belowRoot) {
          vCondition = currY < (cm.nodeY + cm.maxH / 2 + overlap)
        } else if (cm.isBottom && aboveRoot) {
          vCondition = currY > (cm.nodeY - cm.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(currY - cm.nodeY) <= cm.maxH / 2 + overlap
        }
        let hCondition =
          (cm.path[3] === 0 && currX > cm.nodeEndX) ||
          (cm.path[3] === 1 && currX < cm.nodeStartX)
        if (vCondition && hCondition) {
          lastNearestPath = copy(cm.path)
          cm.s.map(i => mapFindNearest.iterate(i))
        }
      }
      cm.c.map(i => i.map(j => mapFindNearest.iterate(j)))
    }
  }
}
