import {M, T} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {getNodeByPath, sortPath, mT, isSEO, getTR, getRSCIPL} from "./MapQueries.ts"

export const mapFindNearest = (pm: M, moveNode: T, toX: number, toY: number) => {
  const m = pm.slice().sort(sortPath)
  let sMoveCoords = [] as number[]
  let moveInsertParentNode = {nodeId: ''} as T
  let moveTargetIndex = 0
  if (!(
    moveNode.nodeStartX < toX &&
    toX < (moveNode.nodeStartX + moveNode.selfW) &&
    moveNode.nodeStartY < toY &&
    toY < (moveNode.nodeStartY + moveNode.selfH)
  )) {
    const nr = getTR(m, moveNode)
    const aboveRoot = toY >= nr.nodeStartY + nr.selfH / 2
    const belowRoot = toY < nr.nodeStartY + nr.selfH / 2
    const overlap = 6
    mT(m).filter(ti => ti.path.at(1) === nr.path.at(1)).forEach(ti => {
      if (!isSEO(moveNode.path, ti.path)) {
        let vCondition
        if (ti.isTop && belowRoot) {
          vCondition = toY < (ti.nodeStartY + ti.selfH / 2 + ti.maxH / 2 + overlap)
        } else if (ti.isBottom && aboveRoot) {
          vCondition = toY > (ti.nodeStartY + ti.selfH / 2 - ti.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(toY - ti.nodeStartY - ti.selfH / 2) <= ti.maxH / 2 + overlap
        }
        let hCondition = toX > (ti.nodeStartX + ti.selfW)
        if (vCondition && hCondition ) {
          moveInsertParentNode = ti
        }
      }
    })
    if (moveInsertParentNode.nodeId.length) {
      const moveInsertParentNodeNSO1 = moveInsertParentNode.so1.length
      const fromX = moveInsertParentNode.nodeStartX + moveInsertParentNode.selfW
      const fromY = moveInsertParentNode.nodeStartY + moveInsertParentNode.selfH / 2
      sMoveCoords = [fromX, fromY, toX, toY]
      if (moveInsertParentNodeNSO1) {
        moveTargetIndex = moveInsertParentNodeNSO1
        for (let i = moveInsertParentNodeNSO1 - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(m, [...moveInsertParentNode.path, 's', i])
          if (toY < currMoveTargetNodeChild.nodeStartY + currMoveTargetNodeChild.selfH / 2) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveInsertParentNode.path, getRSCIPL(moveNode.path).at(-1)) && moveNode.path.at(-1) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveInsertParentNode.path, getRSCIPL(moveNode.path).at(-1)) && moveNode.path.at(-1) === moveTargetIndex) {
    moveInsertParentNode = {} as T
    moveTargetIndex = 0
    sMoveCoords = []
  }
  return { sMoveCoords, moveInsertParentNodeId: moveInsertParentNode.nodeId || '', moveTargetIndex }
}
