import {getNodeByPath} from "../core/MapUtils"
import {ML, Path, PathItem} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {N} from "../state/NPropsTypes"

const pathPattern = (path: Path) => path.filter((el: PathItem) => isNaN(el as any)).join('')
const endsWithPathPattern = (path: Path, pattern: string) => pathPattern(path).slice(-pattern.length) === pattern
const getParentPath = (path: Path) => {
  switch (pathPattern(path).at(-1)) {
    case 'd': return path.slice(0, -2)
    case 's': return path.slice(0, -2)
    case 'c': return path.slice(0, -3)
    default: return path
  }
}

export const mapPlaceLinear = (mlp: ML) => {
  const g = getNodeByPath(mlp, ['g']) as G
  const r0 = getNodeByPath(mlp, ['r', 0]) as N
  const r0d0 = getNodeByPath(mlp, ['r', 0, 'd', 0]) as N
  const r0d1 = getNodeByPath(mlp, ['r', 0, 'd', 1]) as N

  const { alignment, taskConfigWidth, taskLeft, taskRight, margin, sLineDeltaXDefault } = g
  const leftTaskWidth = r0d1.sCount > 0 && taskLeft ? taskConfigWidth : 0
  const leftMapWidth = r0d1.sCount > 0 ? sLineDeltaXDefault + r0d1.familyW : 0
  const rightMapWidth = r0d0.sCount > 0 ? sLineDeltaXDefault + r0d0.familyW : 0
  const rightTaskWidth = r0d0.sCount > 0 && taskRight ? taskConfigWidth : 0
  const leftWidth = leftMapWidth + leftTaskWidth + margin
  const rightWidth = rightMapWidth + rightTaskWidth + margin
  let flow = 'both'
  if (r0d0.sCount && !r0d1.sCount) flow = 'right'
  if (!r0d0.sCount && r0d1.sCount) flow = 'left'
  let sumWidth = 0
  if (alignment === 'adaptive') {
    if (flow === 'right') {
      sumWidth = margin + r0.selfW + rightWidth
    } else if (flow === 'left') {
      sumWidth = leftWidth + r0.selfW + margin
    } else if (flow === 'both') {
      sumWidth = leftWidth + r0.selfW + rightWidth
    }
  } else if (alignment === 'centered') {
    sumWidth = 2 * Math.max(...[leftWidth, rightWidth]) + r0.selfW
  }
  const divMinWidth = window.screen.availWidth > 1280 ? 1280 : 800
  const mapWidth = sumWidth > divMinWidth ? sumWidth : divMinWidth
  let mapStartCenterX = 0
  if (alignment === 'centered') {
    mapStartCenterX = mapWidth / 2
  } else if (alignment === 'adaptive') {
    if (flow === 'both') {
      let leftSpace = sumWidth < divMinWidth ? (divMinWidth - sumWidth) / 2 : 0
      mapStartCenterX = leftSpace + leftWidth + r0.selfW / 2
    } else if (flow === 'right') {
      mapStartCenterX = margin + r0.selfW / 2
    } else if (flow === 'left') {
      mapStartCenterX = mapWidth - margin - r0.selfW / 2
    }
  }
  const rightMapHeight = r0.dCount > 0 ? r0d0.familyH : 0
  const leftMapHeight = r0.dCount > 1 ? r0d1.familyH : 0
  const mapHeight = Math.max(...[rightMapHeight, leftMapHeight]) + 60

  for (const n of mlp) {
    if (n.path.length === 1) {
      n.mapWidth = mapWidth
      n.mapHeight = mapHeight
    } else if (n.path.length === 2) {
      n.lineDeltaX = 0
      n.lineDeltaY = mapHeight / 2 - 0.5
      n.nodeStartX = mapStartCenterX - n.selfW / 2 + 1
      n.nodeEndX = mapStartCenterX + n.selfW / 2 + 1
      n.nodeY = n.lineDeltaY
    } else if (n.type === 'dir') {
      n.lineDeltaX = 0
      n.lineDeltaY = 0
      n.nodeStartX = r0.nodeStartX
      n.nodeEndX = r0.nodeEndX
      n.nodeY = r0.lineDeltaY
      n.isTop = 1
      n.isBottom = 1
      n.selfW = r0.selfW // THIS SHOULD HAVE BEEN ASSIGNED IN MapMeasure
      n.selfH = r0.selfH // THIS SHOULD HAVE BEEN ASSIGNED IN MapMeasure
    } else {
      const pn = getNodeByPath(mlp, getParentPath(n.path)) as N
      const ppn = getNodeByPath(mlp, getParentPath(pn.path)) as N
      if (n.type === 'struct') {
        const i = n.path.at(-1) as number
        n.lineDeltaX = g.sLineDeltaXDefault
        n.lineDeltaY = - pn.familyH / 2 + n.maxH / 2 + pn.sumElapsedY[i]
        n.nodeY = pn.nodeY + n.lineDeltaY
        n.isTop = i === 0 && pn.isTop ? 1 : 0
        n.isBottom = i === pn.sCount - 1 && pn.isBottom === 1 ? 1 : 0
      } else if (n.type === 'cell') {
        const i = n.path.at(-2) as number
        const j = n.path.at(-1) as number
        n.lineDeltaX = pn.sumMaxColWidth[j] + 20
        n.lineDeltaY = pn.nodeY + pn.sumMaxRowHeight[i] + pn.maxRowHeight[i]/2 - pn.selfH/2 - ppn.nodeY
        n.nodeY = ppn.nodeY + n.lineDeltaY
      }
      if (endsWithPathPattern(n.path, 'ds') || endsWithPathPattern(n.path, 'ss')) {
        n.nodeStartX = n.path[3] === 0 ? pn.nodeEndX + n.lineDeltaX : pn.nodeStartX - n.lineDeltaX - n.selfW
        n.nodeEndX = n.path[3] === 0 ? pn.nodeEndX + n.lineDeltaX + n.selfW : pn.nodeStartX - n.lineDeltaX
      } else if (endsWithPathPattern(n.path, 'cs')) {
        n.nodeStartX = n.path[3] === 0 ? pn.nodeStartX + 2 : pn.nodeEndX - n.selfW
        n.nodeEndX = n.path[3] === 0 ? pn.nodeStartX + 2 + n.selfW : pn.nodeEndX
      } else if (endsWithPathPattern(n.path, 'dsc') || endsWithPathPattern(n.path, 'ssc')) {
        const diff = g.sLineDeltaXDefault - 20
        n.nodeStartX = n.path[3] === 0 ? ppn.nodeEndX + n.lineDeltaX + diff : ppn.nodeStartX - n.lineDeltaX - diff
        n.nodeEndX = n.path[3] === 0 ? ppn.nodeEndX + n.lineDeltaX + diff + n.selfW : ppn.nodeStartX - n.lineDeltaX - diff
      } else if (endsWithPathPattern(n.path, 'csc')) {
        n.nodeStartX = n.path[3] === 0 ? ppn.nodeStartX + 2 : ppn.nodeEndX - n.selfW
        n.nodeEndX = n.path[3] === 0 ? ppn.nodeStartX + 2 + n.selfW : ppn.nodeEndX
      }
    }
    if (Number.isInteger(n.nodeStartX)) {
      n.nodeStartX += n.path[3] === 0 ?  0.5 : - 0.5
      n.nodeEndX += n.path[3] === 0 ?  0.5 : - 0.5
    }
    if (Number.isInteger(n.nodeY)) {
      n.nodeY += 0.5
    }
  }
}
