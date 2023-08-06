import {M, GN, P, N} from "../state/MapStateTypes"
import isEqual from "react-fast-compare"
import {getCountSO1, getNodeById, getNodeByPath, getSI1, getRi, isD, isS, isSO, sortPath} from "./MapUtils"

export const mapFindNearest = (pm: M, moveNode: N, toX: number, toY: number) => {
  const m = structuredClone(pm).sort(sortPath)
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
    const rx = getNodeByPath(m, ['r', ri]) as N
    const aboveRoot = toY >= rx.nodeY
    const belowRoot = toY < rx.nodeY
    const overlap = 6
    let moveTargetNodeId = ''
    m.forEach(n => {
      if (getRi(n.path) === ri && (isS(n.path) || isD(n.path)) && n.nodeId !== moveNode.nodeId && !isSO(moveNode.path, n.path)) {
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
      const moveTargetNodeCountSS = getCountSO1(m, moveTargetNode.path)
      const fromX = moveTargetNode.path[3] ? moveTargetNode.nodeStartX : moveTargetNode.nodeEndX
      const fromY = moveTargetNode.nodeY
      moveCoords = [fromX, fromY, toX, toY]
      if (moveTargetNodeCountSS) {
        moveTargetIndex = moveTargetNodeCountSS
        for (let i = moveTargetNodeCountSS - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(m, [...moveTargetNode.path, 's', i]) as GN
          if (toY < currMoveTargetNodeChild.nodeY) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveTargetNode.path, getSI1(moveNode.path)) && (moveNode.path.at(-1) as number) < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(getSI1(moveNode.path), moveTargetPath) && moveNode.path.at(-1) === moveTargetIndex) {
    moveTargetPath = []
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveTargetPath, moveTargetIndex }
}
