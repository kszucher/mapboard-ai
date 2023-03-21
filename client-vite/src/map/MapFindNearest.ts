import {copy, isEqual} from "../core/Utils"
import {getNodeById, getNodeByPath, isSubNode} from "../core/MapUtils"
import {ML, NL} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapFindNearest = (ml: ML, moveNode: N, toX: number, toY: number) => {
  const mlp = copy(ml).sort((a: NL, b: NL) => (a.path > b.path) ? 1 : -1)
  let moveCoords = [] as any[]
  let moveTargetPath = [] as any[]
  let moveTargetIndex = 0
  if (!(moveNode.nodeStartX < toX && toX < moveNode.nodeEndX && moveNode.nodeY - moveNode.selfH / 2 < toY && toY < moveNode.nodeY + moveNode.selfH / 2)) {
    const r0 = getNodeByPath(ml, ['r', 0])
    const aboveRoot = toY >= r0.nodeY
    const belowRoot = toY < r0.nodeY
    const overlap = 6
    let moveTargetNodeId = ''
    for (const n of mlp) {
      if ((n.type === 'struct' || n.type === 'dir') && n.nodeId !== moveNode.nodeId && !isSubNode(moveNode.path, n.path)) {
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
    }
    if (moveTargetNodeId.length) {
      const moveTargetNode = getNodeById(mlp, moveTargetNodeId)
      const fromX = moveTargetNode.path[3] ? moveTargetNode.nodeStartX : moveTargetNode.nodeEndX
      const fromY = moveTargetNode.nodeY
      moveCoords = [fromX, fromY, toX, toY]
      if (moveTargetNode.sCount ) {
        moveTargetIndex = moveTargetNode.sCount
        for (let i = moveTargetNode.sCount - 1; i > -1; i--) {
          const currMoveTargetNodeChild = getNodeByPath(ml, [...moveTargetNode.path, 's', i])
          if (toY < currMoveTargetNodeChild.nodeY) {
            moveTargetIndex = i
          }
        }
        if (isEqual(moveTargetNode.path, moveNode.parentPath) && moveNode.index < moveTargetIndex) {
          moveTargetIndex -= 1
        }
      }
    }
  }
  if (isEqual(moveNode.parentPath, moveTargetPath) && moveNode.index === moveTargetIndex) {
    moveTargetPath = []
    moveTargetIndex = 0
    moveCoords = []
  }
  return { moveCoords, moveTargetPath, moveTargetIndex }
}
