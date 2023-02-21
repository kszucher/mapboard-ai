//@ts-nocheck

import { updateMapSvgData } from '../core/DomFlow'
import {isEqual, isOdd} from '../core/Utils'
import { resolveScope } from '../core/DefaultProps'
import { getColors } from '../core/Colors'
import { getArcPath, getBezierPath, getLinePath, getPolygonPath } from '../core/SvgUtils'
import { getMapData } from '../core/MapFlow'
import {getEditedNodeId, getMoveTarget, getSelectTarget} from "../core/EditorFlow";
import {mapFindById} from "./MapFindById";

const getAdjustedParams = (cn) => {
  const selfHadj = isOdd(cn.selfH) ? cn.selfH + 1 : cn.selfH
  const maxHadj = isOdd(cn.maxH) ? cn.maxH + 1 : cn.maxH
  const dir = cn.path[3] ? -1 : 1
  return {
    dir,
    nsx: dir === -1 ? cn.nodeEndX : cn.nodeStartX,
    nex: dir === -1 ? cn.nodeStartX : cn.nodeEndX,
    nsy: cn.nodeY - selfHadj / 2,
    ney: cn.nodeY + selfHadj / 2,
    nsym: cn.nodeY - maxHadj / 2,
    neym: cn.nodeY + maxHadj / 2,
    totalw: cn.familyW + cn.selfW,
    deltax: cn.lineDeltaX,
    margin: (
      (cn.selection === 's' && cn.sBorderColor !== '') ||
      (cn.selection === 's' && cn.sFillColor !== '') ||
      (cn.selection === 'f') ||
      (cn.taskStatus > 1) ||
      (cn.hasCell)
    ) ? 4 : -2,
    r: 8
  }
}

const getNodeVisParams = (selection, adjustedParams) => {
  const { dir, nsx, nex, nsy, ney, nsym, neym, totalw, deltax, r } = adjustedParams
  if (selection === 's') {
    return {
      ax: dir ===  - 1 ? nex : nsx,
      bx: nex - dir * r,
      cx: dir === - 1 ? nsx : nex,
      ayu: nsy,
      ayd: ney,
      byu: nsy,
      byd: ney,
      cyu: nsy,
      cyd: ney
    }
  } else if (selection === 'f') {
    return {
      ax: dir === -1 ? nsx + dir * totalw : nsx,
      bx: nex + dir * deltax,
      cx: dir === -1 ? nsx : nsx + dir * totalw,
      ayu: dir === -1 ? nsym : nsy,
      ayd: dir === -1 ? neym : ney,
      byu: nsym,
      byd: neym,
      cyu: dir === -1 ? nsy : nsym,
      cyd: dir === -1 ? ney : neym,
    }
  }
}

export const mapVisualizeSvg = {
  start: (m, colorMode, shouldAnimationInit) => {
    const editedNodeId = getEditedNodeId()
    const editedPath = editedNodeId.length ? getMapData(m, mapFindById.start(m, editedNodeId))?.path : []
    const moveTarget = getMoveTarget()
    const selectTarget = getSelectTarget()
    const mapSvgOuter = document.getElementById('mapSvgOuter')
    mapSvgOuter.style.width = 'calc(200vw + ' + m.g.mapWidth + 'px)'
    mapSvgOuter.style.height = 'calc(200vh + ' + m.g.mapHeight + 'px)'
    const {SELECTION_COLOR, MAP_BACKGROUND, MOVE_LINE_COLOR, MOVE_RECT_COLOR, SELECTION_RECT_COLOR} = getColors(colorMode)
    if (true) {
      updateMapSvgData('m', 'backgroundRect', {
        x: 0,
        y: 0,
        width: m.g.mapWidth,
        height: m.g.mapHeight,
        rx: 32,
        ry: 32,
        fill: MAP_BACKGROUND,
      })
    }
    if (moveTarget.moveData?.length) {
      // TODO use parent bezier style
      const deltaX = moveTarget.moveData[2] - moveTarget.moveData[0]
      const deltaY = moveTarget.moveData[3] - moveTarget.moveData[1]
      const x1 = moveTarget.moveData[0]
      const y1 = moveTarget.moveData[1]
      const c1x = moveTarget.moveData[0] + deltaX / 4
      const c1y = moveTarget.moveData[1]
      const c2x = moveTarget.moveData[0] + deltaX / 4
      const c2y = moveTarget.moveData[1] + deltaY
      const x2 = moveTarget.moveData[2]
      const y2 = moveTarget.moveData[3]
      updateMapSvgData('m', 'moveLine', {
        path: getBezierPath('M', [x1, y1, c1x, c1y, c2x, c2y, x2, y2]),
        stroke: MOVE_LINE_COLOR,
        strokeWidth: 1,
        preventTransition: 1,
      })
      updateMapSvgData('m', 'moveRect', {
        x: x2 - 10,
        y: y2 - 10,
        width: 20,
        height: 20,
        rx: 8,
        ry: 8,
        fill: MAP_BACKGROUND,
        fillOpacity: 1,
        stroke: MOVE_RECT_COLOR,
        strokeWidth: 5,
        preventTransition: 1,
      })
    }
    if (Object.keys(selectTarget).length && selectTarget.selectionRect.length) {
      updateMapSvgData('m', 'selectionRect', {
        x: selectTarget.selectionRect[0],
        y: selectTarget.selectionRect[1],
        width: selectTarget.selectionRect[2],
        height: selectTarget.selectionRect[3],
        rx: 8,
        ry: 8,
        fill: SELECTION_RECT_COLOR,
        fillOpacity: 0.05,
        strokeWidth: 2,
        preventTransition: 1,
      })
    }
    if (m.g.sc.structSelectedPathList.length && !editedPath.length) {
      const cn = getMapData(m, m.g.sc.lastPath)
      const adjustedParams = getAdjustedParams(cn)
      const { dir, margin } = adjustedParams
      updateMapSvgData('m', 'selectionBorderMain', {
        path: getPolygonPath(getNodeVisParams(cn.selection, adjustedParams), cn.selection, dir, margin),
        stroke: SELECTION_COLOR,
        strokeWidth: 1,
      })
    }
    mapVisualizeSvg.iterate(m, m.r[0], colorMode, shouldAnimationInit, editedPath)
  },
  iterate: (m, cn, colorMode, shouldAnimationInit, editedPath) => {
    const conditions = resolveScope(cn)
    const {
      SELECTION_COLOR,
      TABLE_FRAME_COLOR,
      TABLE_GRID,
      TASK_LINE_1, TASK_LINE_2, TASK_LINE_3,
      TASK_FILL_1, TASK_FILL_2, TASK_FILL_3,
      TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE,
      TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE,
      TASK_LINE
    } = getColors(colorMode)
    const adjustedParams = getAdjustedParams(cn)
    const { dir, nsx, nex, nsy, ney, margin, r } = adjustedParams
    if (conditions.branchFill) {
      updateMapSvgData(cn.nodeId, 'branchFill', {
        path: getPolygonPath(getNodeVisParams('f', adjustedParams), 'f', dir, 0),
        fill: cn.fFillColor,
      })
    }
    if (conditions.nodeFill) {
      let sFillColorOverride = ''
      if (cn.taskStatus > 1) {
        sFillColorOverride = [TASK_FILL_1, TASK_FILL_2, TASK_FILL_3].at(cn.taskStatus - 2)
      }
      updateMapSvgData(cn.nodeId, 'nodeFill', {
        path: getArcPath(nsx, nsy , cn.selfW, cn.selfH, r, dir, -2, true),
        fill: sFillColorOverride === '' ? cn.sFillColor : sFillColorOverride
      })
    }
    if (conditions.branchBorder) {
      updateMapSvgData(cn.nodeId, 'branchBorder', {
        path: getPolygonPath(getNodeVisParams('f', adjustedParams), 'f', dir, 0),
        stroke: cn.fBorderColor,
        strokeWidth: cn.fBorderWidth,
      })
    }
    if (conditions.nodeBorder) {
      updateMapSvgData(cn.nodeId, 'nodeBorder', {
        path: getArcPath(nsx, nsy , cn.selfW, cn.selfH, r, dir, -2, true),
        stroke: cn.sBorderColor,
        strokeWidth: cn.sBorderWidth,
      })
    }
    if (conditions.selectionBorder && !isEqual(cn.path, m.g.sc.lastPath)) {
      updateMapSvgData(cn.nodeId, 'selectionBorder', {
        path: getPolygonPath(getNodeVisParams(cn.selection, adjustedParams), cn.selection, dir, margin),
        stroke: SELECTION_COLOR,
        strokeWidth: 1,
      })
    }
    if (conditions.line) {
      let x1, y1, x2, y2
      if (shouldAnimationInit && cn.animationRequested) {
        x1 = dir === - 1 ? cn.parentNodeStartXFrom : cn.parentNodeEndXFrom
        y1 = cn.parentNodeYFrom
      } else {
        x1 = dir === - 1 ? cn.parentNodeStartX : cn.parentNodeEndX
        y1 = cn.parentNodeY
      }
      x1 = isOdd(x1)?x1-0.5:x1
      x2 = nsx
      y2 = cn.nodeY
      let lineColorOverride = ''
      if (cn.taskStatus > 1) {
        lineColorOverride = [TASK_LINE_1, TASK_LINE_2, TASK_LINE_3].at(cn.taskStatus - 2)
      }
      updateMapSvgData(cn.nodeId, 'line', {
        path: getLinePath(cn.lineType, x1, y1, cn.lineDeltaX, cn.lineDeltaY, x2, y2, dir),
        strokeWidth: cn.lineWidth,
        stroke: lineColorOverride === ''
          ? cn.lineColor
          : lineColorOverride
      })
    }
    if (conditions.table) {
      // frame
      updateMapSvgData(cn.nodeId, 'tableFrame', {
        path: getArcPath(nsx, nsy, cn.selfW, cn.selfH, r, dir, 0),
        stroke: cn.sBorderColor === '' ? TABLE_FRAME_COLOR : cn.sBorderColor,
        strokeWidth: cn.sBorderWidth,
      })
      // grid
      let path = ''
      let rowCount = Object.keys(cn.c).length
      for (let i = 1; i < rowCount; i++) {
        let x1 = cn.nodeStartX
        let x2 = cn.nodeEndX
        let y = nsy + cn.sumMaxRowHeight[i]
        path += `M${x1},${y} L${x2},${y}`
      }
      let colCount = Object.keys(cn.c[0]).length
      for (let j = 1; j < colCount; j++) {
        let x = nsx + dir*cn.sumMaxColWidth[j]
        path += `M${x},${nsy} L${x},${ney}`
      }
      updateMapSvgData(cn.nodeId, 'tableGrid', {
        path: path,
        stroke: TABLE_GRID,
        strokeWidth: 1,
      })
      // cell
      tableLoops:
        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < colCount; j++) {
            if (cn.c[i][j].selected) {
              let sx, sy, w, h
              if (m.g.sc.cellRowSelected) {
                sx = nsx
                sy = nsy + cn.sumMaxRowHeight[i]
                w = cn.selfW
                h = cn.sumMaxRowHeight[i+1] - cn.sumMaxRowHeight[i]
              } else if (m.g.sc.cellColSelected) {
                sx = nsx + dir*cn.sumMaxColWidth[j]
                sy = nsy
                w = cn.sumMaxColWidth[j+1] - cn.sumMaxColWidth[j]
                h = cn.selfH
              } else {
                sx = nsx + dir*cn.sumMaxColWidth[j]
                sy = nsy + cn.sumMaxRowHeight[i]
                w = cn.sumMaxColWidth[j+1] - cn.sumMaxColWidth[j]
                h = cn.sumMaxRowHeight[i+1] - cn.sumMaxRowHeight[i]
              }
              const tableVisParams = {
                ax: dir === - 1 ? sx + dir * w : sx,
                bx: sx + dir*w,
                cx: dir === - 1 ? sx : sx + dir * w,
                ayu: sy,
                ayd: sy + h,
                byu: sy,
                byd: sy + h,
                cyu: sy,
                cyd: sy + h,
              }
              updateMapSvgData(cn.nodeId, 'selectionBorder', {
                path: getPolygonPath(tableVisParams, 's', dir, 4),
                stroke: SELECTION_COLOR,
                strokeWidth: 1,
              })
              break tableLoops
            }
          }
        }
    }
    if (conditions.task) {
      const {mapWidth, margin, taskConfigN, taskConfigD, taskConfigGap, taskConfigWidth} = m.g
      let startX
      if (cn.path.includes('c')) {
        let coverCellPath = cn.path.slice(0, cn.path.lastIndexOf('c'))
        let currCol = cn.path[cn.path.lastIndexOf('c') + 2]
        let coverCellRef = getMapData(m, coverCellPath)
        let smcv = coverCellRef.sumMaxColWidth[currCol]
        let mcv = coverCellRef.maxColWidth[currCol]
        startX = dir === - 1
          ? coverCellRef.nodeEndX - smcv - mcv + 120
          : coverCellRef.nodeStartX + smcv + mcv - 120
      } else {
        startX = dir === - 1
          ? margin + taskConfigWidth
          : mapWidth - taskConfigWidth - margin
      }
      let x1 = nex
      let x2 = startX
      let y = cn.nodeY
      if (!isEqual(cn.path, editedPath)) {
        updateMapSvgData(cn.nodeId, 'taskLine', {
          path: `M${x1},${y} L${x2},${y}`,
          stroke: TASK_LINE,
          strokeWidth: 1,
        })
      }
      for (let i = 0; i < taskConfigN; i++) {
        const cx = dir === - 1
          ? startX - taskConfigD/2 - i * (taskConfigD + taskConfigGap)
          : startX + taskConfigD/2 + i * (taskConfigD + taskConfigGap)
        const cy = cn.nodeY
        const r = taskConfigD / 2
        const fill = cn.taskStatus === i + 1
          ? [TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE].at(i)
          : [TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE].at(i)
        updateMapSvgData(cn.nodeId, `taskCircle${i + 1}`, { cx, cy, r, fill })
      }
    }
    cn.d.map(i => mapVisualizeSvg.iterate(m, i, colorMode, shouldAnimationInit, editedPath))
    cn.s.map(i => mapVisualizeSvg.iterate(m, i, colorMode, shouldAnimationInit, editedPath))
    cn.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j, colorMode, shouldAnimationInit, editedPath)))
  }
}
