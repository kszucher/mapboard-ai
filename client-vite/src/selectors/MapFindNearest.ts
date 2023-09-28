import {M, P, T} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {getCountTSO1, getNodeByPath, sortPath, mT, isSEO, getTR, getSIPL, getTRD0SO, getTRD1SO} from "./MapSelector"

export const mapFindNearest = (pm: M, moveNode: T, toX: number, toY: number) => {
  const m = pm.slice().sort(sortPath)
  let moveCoords = [] as number[]
  let moveInsertParentNode = {} as T
  let moveTargetIndex = 0
  if (!(
    moveNode.nodeStartX < toX &&
    toX < moveNode.nodeEndX &&
    moveNode.nodeY - moveNode.selfH / 2 < toY &&
    toY < moveNode.nodeY + moveNode.selfH / 2)
  ) {
    const nr = getTR(m, moveNode)
    const aboveRoot = toY >= nr.nodeY
    const belowRoot = toY < nr.nodeY
    const overlap = 6
    const stuff = [...getTRD0SO(mT(m), moveNode), ...getTRD1SO(mT(m), moveNode)]
    stuff.forEach(t => {
      if (!isSEO(moveNode.path, t.path)) {
        let vCondition
        if (t.isTop && belowRoot) {
          vCondition = toY < (t.nodeY + t.maxH / 2 + overlap)
        } else if (t.isBottom && aboveRoot) {
          vCondition = toY > (t.nodeY - t.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(toY - t.nodeY) <= t.maxH / 2 + overlap
        }
        let hCondition = (t.path[3] === 0 && toX > t.nodeEndX) || (t.path[3] === 1 && toX < t.nodeStartX)
        if (vCondition && hCondition ) {
          moveInsertParentNode = t
        }
      }
    })
    if (moveInsertParentNode.nodeId.length) {
      const moveInsertParentNodeNSO1 = getCountTSO1(m, moveInsertParentNode)
      const fromX = moveInsertParentNode.path[3] ? moveInsertParentNode.nodeStartX : moveInsertParentNode.nodeEndX
      const fromY = moveInsertParentNode.nodeY
      moveCoords = [fromX, fromY, toX, toY]
      if (moveInsertParentNodeNSO1) {
        moveTargetIndex = moveInsertParentNodeNSO1
        for (let i = moveInsertParentNodeNSO1 - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(m, [...moveInsertParentNode.path, 's', i])
          if (toY < currMoveTargetNodeChild.nodeY) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveInsertParentNode.path, getSIPL(moveNode.path).at(-1) as P) && (moveNode.path.at(-1) as number) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveInsertParentNode.path, getSIPL(moveNode.path).at(-1) as P) && moveNode.path.at(-1) === moveTargetIndex) {
    moveInsertParentNode = {} as T
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveInsertParentNodeId: moveInsertParentNode.nodeId || '', moveTargetIndex }
}
