import {getNodeByPath, getParentPath, is_G, is_R, is_D, is_S, is_C, is_S_U, getPattern} from "./MapUtils"
import {G, M, N} from "../state/MapPropTypes"

export const mapPlace = (m: M) => {
  const g = getNodeByPath(m, ['g']) as G
  const r0 = getNodeByPath(m, ['r', 0]) as N
  m.forEach(n => {
    if (is_G(n.path)) {
      // do nothing
    } else if (is_R(n.path)) {
      n.lineDeltaX = 0
      n.lineDeltaY = g.mapHeight / 2 - 0.5
      n.nodeStartX = g.mapStartCenterX - n.selfW / 2 + 1
      n.nodeEndX = g.mapStartCenterX + n.selfW / 2 + 1
      n.nodeY = n.lineDeltaY
    } else if (is_D(n.path)) {
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
      const pn = getNodeByPath(m, getParentPath(n.path)) as N
      const ppn = getNodeByPath(m, getParentPath(pn.path)) as N
      if (is_S(n.path)) {
        const i = n.path.at(-1) as number
        const sumUpperSiblingMaxH = m.filter(nt => is_S_U(n.path, nt.path)).map(n => n.maxH).reduce((a, b) => a + b, 0)
        const sumElapsedY = sumUpperSiblingMaxH + i * pn.spacing * pn.spacingActivated
        n.lineDeltaX = g.sLineDeltaXDefault
        n.lineDeltaY = - pn.familyH / 2 + n.maxH / 2 + sumElapsedY
        if (getPattern(n.path).endsWith('ds') || getPattern(n.path).endsWith('ss')) {
          n.nodeStartX = n.path[3] === 0 ? pn.nodeEndX + n.lineDeltaX : pn.nodeStartX - n.lineDeltaX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? pn.nodeEndX + n.lineDeltaX + n.selfW : pn.nodeStartX - n.lineDeltaX
        } else if (getPattern(n.path).endsWith('cs')) {
          n.nodeStartX = n.path[3] === 0 ? pn.nodeStartX + 2 : pn.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? pn.nodeStartX + 2 + n.selfW : pn.nodeEndX
        }
        n.nodeY = pn.nodeY + n.lineDeltaY
        n.isTop = i === 0 && pn.isTop ? 1 : 0
        n.isBottom = i === pn.sCount - 1 && pn.isBottom === 1 ? 1 : 0
      } else if (is_C(n.path)) {
        const i = n.path.at(-2) as number
        const j = n.path.at(-1) as number
        n.lineDeltaX = pn.sumMaxColWidth[j] + 20
        n.lineDeltaY = pn.nodeY + pn.sumMaxRowHeight[i] + pn.maxRowHeight[i]/2 - pn.selfH/2 - ppn.nodeY
        if (getPattern(n.path).endsWith('dsc') || getPattern(n.path).endsWith('ssc')) {
          const diff = g.sLineDeltaXDefault - 20
          n.nodeStartX = n.path[3] === 0 ? ppn.nodeEndX + n.lineDeltaX + diff : ppn.nodeStartX - n.lineDeltaX - diff
          n.nodeEndX = n.path[3] === 0 ? ppn.nodeEndX + n.lineDeltaX + diff + n.selfW : ppn.nodeStartX - n.lineDeltaX - diff
        } else if (getPattern(n.path).endsWith('csc')) {
          n.nodeStartX = n.path[3] === 0 ? ppn.nodeStartX + 2 : ppn.nodeEndX - n.selfW
          n.nodeEndX = n.path[3] === 0 ? ppn.nodeStartX + 2 + n.selfW : ppn.nodeEndX
        }
        n.nodeY = ppn.nodeY + n.lineDeltaY
      }
    }
    if (Number.isInteger(n.nodeStartX)) {
      n.nodeStartX += n.path[3] === 0 ?  0.5 : - 0.5
      n.nodeEndX += n.path[3] === 0 ?  0.5 : - 0.5
    }
    if (Number.isInteger(n.nodeY)) {
      n.nodeY += 0.5
    }
  })
}
