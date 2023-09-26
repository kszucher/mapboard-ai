import {M, N, P, T} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {getCountNSO1, getNodeById, getNodeByPath, getSI1P, getRi, sortPath, mT, isNRD0SO, isNRD1SO, isSEO} from "./MapSelector"

export const mapFindNearest = (pm: M, moveNode: T, toX: number, toY: number) => {
  const m = pm.slice().sort(sortPath)
  let moveCoords = [] as number[]
  let moveTargetPath = [] as P
  let moveTargetIndex = 0
  if (!(
    moveNode.nodeStartX < toX &&
    toX < moveNode.nodeEndX &&
    moveNode.nodeY - moveNode.selfH / 2 < toY &&
    toY < moveNode.nodeY + moveNode.selfH / 2)
  ) {
    const ri = getRi(moveNode.path)
    const rx = getNodeByPath(m, ['r', ri]) as T
    const aboveRoot = toY >= rx.nodeY
    const belowRoot = toY < rx.nodeY
    const overlap = 6
    let moveTargetNodeId = ''
    mT(m).forEach(t => {
      if ((isNRD0SO(t.path, moveNode.path) || isNRD1SO(t.path, moveNode.path)) && !isSEO(moveNode.path, t.path)) {
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
          moveTargetPath = t.path
          moveTargetNodeId = t.nodeId
        }
      }
    })
    if (moveTargetNodeId.length) {
      const moveTargetNode = getNodeById(m, moveTargetNodeId) as N
      const moveTargetNodeCountSS = getCountNSO1(m, moveTargetNode)
      const fromX = moveTargetNode.path[3] ? moveTargetNode.nodeStartX : moveTargetNode.nodeEndX
      const fromY = moveTargetNode.nodeY
      moveCoords = [fromX, fromY, toX, toY]
      if (moveTargetNodeCountSS) {
        moveTargetIndex = moveTargetNodeCountSS
        for (let i = moveTargetNodeCountSS - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(m, [...moveTargetNode.path, 's', i]) as N
          if (toY < currMoveTargetNodeChild.nodeY) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveTargetNode.path, getSI1P(moveNode.path)) && (moveNode.path.at(-1) as number) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveTargetPath, getSI1P(moveNode.path)) && moveNode.path.at(-1) === moveTargetIndex) {
    moveTargetPath = []
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveTargetPath, moveTargetIndex }
}
