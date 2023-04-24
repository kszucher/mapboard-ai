import {M, GN, P, N} from "../state/MapPropTypes"
import isEqual from "react-fast-compare"
import {getNodeById, getNodeByPath, getI1, isD, isS, isSO} from "./MapUtils"

export const mapFindNearest = (m: M, moveNode: N, toX: number, toY: number) => {
  let moveCoords = [] as number[]
  let moveTargetPath = [] as P
  let moveTargetIndex = 0
  if (!(
    moveNode.nodeStartX < toX &&
    toX < moveNode.nodeEndX &&
    moveNode.nodeY - moveNode.selfH / 2 < toY &&
    toY < moveNode.nodeY + moveNode.selfH / 2)
  ) {
    const r0 = getNodeByPath(m, ['r', 0]) as N
    const aboveRoot = toY >= r0.nodeY
    const belowRoot = toY < r0.nodeY
    const overlap = 6
    let moveTargetNodeId = ''
    m.forEach(n => {
      if ((isS(n.path) || isD(n.path)) && n.nodeId !== moveNode.nodeId && !isSO(moveNode.path, n.path)) {
        let vCondition
        if (n.isTop && belowRoot) {
          vCondition = toY < (n.nodeY + n.maxH / 2 + overlap)
        } else if (n.isBottom && aboveRoot) {
          vCondition = toY > (n.nodeY - n.maxH / 2 - overlap)
        } else {
          vCondition = Math.abs(toY - n.nodeY) <= n.maxH / 2 + overlap
        }
        let hCondition = (n.path[3] === 0 && toX > n.nodeEndX) || (n.path[3] === 1 && toX < n.nodeStartX)
        if (vCondition && hCondition ) {
          moveTargetPath = n.path
          moveTargetNodeId = n.nodeId
        }
      }
    })
    if (moveTargetNodeId.length) {
      const moveTargetNode = getNodeById(m, moveTargetNodeId) as GN
      const fromX = moveTargetNode.path[3] ? moveTargetNode.nodeStartX : moveTargetNode.nodeEndX
      const fromY = moveTargetNode.nodeY
      moveCoords = [fromX, fromY, toX, toY]
      if (moveTargetNode.sCount ) {
        moveTargetIndex = moveTargetNode.sCount
        for (let i = moveTargetNode.sCount - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(m, [...moveTargetNode.path, 's', i]) as GN
          if (toY < currMoveTargetNodeChild.nodeY) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveTargetNode.path, getI1(moveNode.path)) && (moveNode.path.at(-1) as number) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(getI1(moveNode.path), moveTargetPath) && moveNode.path.at(-1) === moveTargetIndex) {
    moveTargetPath = []
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveTargetPath, moveTargetIndex }
}
