import {M, T} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {getCountTSO1, getNodeByPath, sortPath, mT, isSEO, getTR, getRDSCIPL} from "./MapSelector"

export const mapFindNearest = (pm: M, moveNode: T, toX: number, toY: number) => {
  const m = pm.slice().sort(sortPath)
  let moveCoords = [] as number[]
  let moveInsertParentNode = {nodeId: ''} as T
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
    mT(m).filter(ti => ti.path.at(1) === nr.path.at(1) /*&& ti.path.length > 2*/).forEach(ti => {
      if (!isSEO(moveNode.path, ti.path)) {
        let vCondition
        if (ti.isTop && belowRoot) {
          vCondition = toY < (ti.nodeY + ti.maxH / 2 + overlap)
        } else if (ti.isBottom && aboveRoot) {
          vCondition = toY > (ti.nodeY - ti.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(toY - ti.nodeY) <= ti.maxH / 2 + overlap
        }
        let hCondition = toX > ti.nodeEndX
        if (vCondition && hCondition ) {
          moveInsertParentNode = ti
        }
      }
    })
    if (moveInsertParentNode.nodeId.length) {
      const moveInsertParentNodeNSO1 = getCountTSO1(m, moveInsertParentNode)
      const fromX = moveInsertParentNode.nodeEndX
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
        if (isEqual(moveInsertParentNode.path, getRDSCIPL(moveNode.path).at(-1)) && moveNode.path.at(-1) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveInsertParentNode.path, getRDSCIPL(moveNode.path).at(-1)) && moveNode.path.at(-1) === moveTargetIndex) {
    moveInsertParentNode = {} as T
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveInsertParentNodeId: moveInsertParentNode.nodeId || '', moveTargetIndex }
}
