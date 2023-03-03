import {M, SC} from "../types/DefaultProps"
import {isEqual} from "../core/Utils"
import {getMapData} from '../core/MapFlow'

export const structDeleteReselect = (m: M, sc: SC) => {
  let ln = getMapData(m, sc.lastPath)
  // calculate jump back
  let closestNode = ln
  for (let i = 0; i < sc.structSelectedPathList.length; i++) {
    let n = getMapData(m, sc.structSelectedPathList[i])
    if (n.path.length < ln.path.length && isEqual(n.path.slice(0, ln.path.length), ln.path)) {
      closestNode = n
    }
  }
  let closestNodeParent = getMapData(m, closestNode.parentPath)
  let closestNodeParentChildLen = closestNodeParent.s.length
  let closestNodeParentChildDelLen = 0
  for (let i = closestNode.index; i > -1; i--) {
    if (closestNodeParent.s[i].selected > 0) {
      closestNodeParentChildDelLen++
    }
  }
  // delete
  for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
    let n = getMapData(m, sc.structSelectedPathList[i])
    let cmParent = getMapData(m, n.parentPath)
    cmParent.taskStatus = n.taskStatus
    cmParent.s.splice(n.index, 1)
  }
  // reselect on jump back
  if (closestNodeParentChildLen === closestNodeParentChildDelLen) {
    if (closestNodeParent.isRootChild) {
      m.r[0].selected = 1
    } else {
      closestNodeParent.selected = 1
    }
  } else {
    if (closestNode.index === 0) {
      if (closestNodeParent.s.length > 0) {
        closestNodeParent.s[0].selected = 1
      } else {
        if (closestNodeParent.isRootChild) {
          m.r[0].selected = 1
        } else {
          closestNodeParent.selected = 1
        }
      }
    } else {
      if (closestNode.index - closestNodeParentChildDelLen >= 0) {
        closestNodeParent.s[closestNode.index - closestNodeParentChildDelLen].selected = 1
      } else {
        closestNodeParent.s[0].selected = 1
      }
    }
  }
}

export const cellDeleteReselect = (m: M, sc: SC) => {
  const { lastPath, isCellRowSelected, cellRow, isCellColSelected, cellCol, sameParentPath } = sc
  let sameParent = getMapData(m, sameParentPath)
  let ln = getMapData(m, lastPath)
  if (isCellRowSelected && getMapData(m, ln.parentPath).c.length === 1 ||
    isCellColSelected && getMapData(m, ln.parentPath).c[0].length === 1) {
    let sameParentParent = getMapData(m, sameParent.parentPath)
    sameParentParent.s.splice(sameParent.index, 1)
    sameParentParent.selected = 1
    return
  }
  if (isCellRowSelected) {
    sameParent.c.splice(cellRow, 1)
    sameParent.selected = 1
  }
  if (isCellColSelected) {
    for (let i = 0; i < sameParent.c.length; i++) {
      sameParent.c[i].splice(cellCol, 1)
    }
    sameParent.selected = 1
  }
}
