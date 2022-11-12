import { mapref } from '../core/MapFlow'
import { copy, isEqual } from '../core/Utils'
import { mapFindOverRectangle } from './MapFindOverRectangle'
import { mapFindNearest } from './MapFindNearest'

// TODO: we MAY join this logic with mapFindOverRectangle, and mapFindNearest, as they are inseparable...
// maybe in a way it is still separated, so MapFindOverRectangle.findMoveTarget, or something
export const findMoveTarget = (m, toX, toY) => {
  // TODO prevent move if multiple nodes are selected
  let moveTargetPath = []
  let moveTargetIndex = 0
  let moveData = []
  let lastSelectedPath = m.sc.structSelectedPathList[0]
  let lastSelected = mapref(m, lastSelectedPath)
  if (!(lastSelected.nodeStartX < toX &&
    toX < lastSelected.nodeEndX &&
    lastSelected.nodeY - lastSelected.selfH / 2 < toY &&
    toY < lastSelected.nodeY + lastSelected.selfH / 2)) {
    let lastNearestPath = mapFindNearest.start(mapref(m, ['r', 0]), toX, toY)
    if (lastNearestPath.length > 2) {
      moveTargetPath = copy(lastNearestPath)
      let lastFound = mapref(m, lastNearestPath)
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
}

export const findSelectTarget = (m, fromX, fromY, toX, toY) => {
  let startX = fromX < toX ? fromX : toX
  let startY = fromY < toY ? fromY : toY
  let width = Math.abs(toX - fromX)
  let height = Math.abs(toY - fromY)
  let selectionRect = [startX, startY, width, height]
  const highlightTargetPathList = mapFindOverRectangle.start(mapref(m, ['r', 0]), startX, startY, width, height)
  return { highlightTargetPathList, selectionRect }
}
