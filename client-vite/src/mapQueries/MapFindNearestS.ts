import {M, R, S, C, PR} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {mS, pathToS, pathToR} from "./MapQueries.ts"
import {sortPath} from "../mapMutations/MapSort.ts"
import {isSEO} from "./PathQueries.ts"

export const mapFindNearestS = (pm: M, moveNode: S, toX: number, toY: number) => {
  const m = pm.slice().sort(sortPath)
  let sMoveCoords = [] as number[]
  let moveInsertParentNode = {nodeId: ''} as R | S | C
  let moveTargetIndex = 0
  if (!(
    moveNode.nodeStartX < toX &&
    toX < (moveNode.nodeStartX + moveNode.selfW) &&
    moveNode.nodeStartY < toY &&
    toY < (moveNode.nodeStartY + moveNode.selfH)
  )) {
    const nr = pathToR(m, moveNode.path.slice(0, 2) as PR)
    const aboveRoot = toY >= nr.nodeStartY + nr.selfH / 2
    const belowRoot = toY < nr.nodeStartY + nr.selfH / 2
    const overlap = 6
    mS(m).filter(si => si.path.at(1) === nr.path.at(1)).forEach(si => {
      if (!isSEO(moveNode.path, si.path)) {
        let vCondition
        if (si.isTop && belowRoot) {
          vCondition = toY < (si.nodeStartY + si.selfH / 2 + si.maxH / 2 + overlap)
        } else if (si.isBottom && aboveRoot) {
          vCondition = toY > (si.nodeStartY + si.selfH / 2 - si.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(toY - si.nodeStartY - si.selfH / 2) <= si.maxH / 2 + overlap
        }
        let hCondition = toX > (si.nodeStartX + si.selfW)
        if (vCondition && hCondition ) {
          moveInsertParentNode = si
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
          const currMoveTargetNodeChild = pathToS(m, [...moveInsertParentNode.path, 's', i])
          if (toY < currMoveTargetNodeChild.nodeStartY + currMoveTargetNodeChild.selfH / 2) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveInsertParentNode.path, moveNode.si1.path) && moveNode.path.at(-1) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveInsertParentNode.path, moveNode.si1.path) && moveNode.path.at(-1) === moveTargetIndex) {
    moveInsertParentNode = {} as R | S | C
    moveTargetIndex = 0
    sMoveCoords = []
  }
  return { sMoveCoords, sMoveInsertParentNodeId: moveInsertParentNode.nodeId || '', sMoveTargetIndex: moveTargetIndex }
}
