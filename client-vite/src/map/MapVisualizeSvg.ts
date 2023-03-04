//@ts-nocheck
import {M, N} from "../types/DefaultProps"
import {updateMapSvgData} from '../core/DomFlow'
import {isEqual, isOdd} from '../core/Utils'
import {resolveScope} from '../core/DefaultProps'
import {getColors} from '../core/Colors'
import {
  getAdjustedParams,
  getArcPath,
  getBezierPath,
  getLinePathBetweenNodes,
  getStructPolygonPoints,
  getPolygonPath,
  getCellPolygonPoints, getLinePoints
} from '../core/SvgUtils'
import {getMapData} from '../core/MapFlow'
import {getEditedNodeId, getMoveTarget, getSelectTarget} from "../core/EditorFlow"
import {mapFindById} from "./MapFindById"

export const mapVisualizeSvg = {
  start: (m: M, colorMode: string, shouldAnimationInit: boolean) => {
    const editedNodeId = getEditedNodeId()
    const editedPath = editedNodeId.length ? getMapData(m, mapFindById.start(m, editedNodeId))?.path : []
    const moveTarget = getMoveTarget()
    const selectTarget = getSelectTarget()
    const mapSvgOuter = document.getElementById('mapSvgOuter') as unknown as SVGElement
    mapSvgOuter.style.width = 'calc(200vw + ' + m.g.mapWidth + 'px)'
    mapSvgOuter.style.height = 'calc(200vh + ' + m.g.mapHeight + 'px)'
    const {SELECTION_COLOR, MAP_BACKGROUND, MOVE_LINE_COLOR, MOVE_RECT_COLOR, SELECTION_RECT_COLOR} = getColors(colorMode)
    // updateMapSvgData('m', 'backgroundRect', {
    //   x: 0,
    //   y: 0,
    //   width: m.g.mapWidth,
    //   height: m.g.mapHeight,
    //   rx: 32,
    //   ry: 32,
    //   fill: MAP_BACKGROUND,
    // })
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
    // if (m.g.sc.structSelectedPathList.length && !editedPath.length) {
    //   const n = getMapData(m, m.g.sc.lastPath)
    //   updateMapSvgData('m', 'selectionBorderMain', {
    //     path: getPolygonPath(n, getStructPolygonPoints(n.selection, n), n.selection, 0),
    //     stroke: SELECTION_COLOR,
    //     strokeWidth: 1,
    //   })
    // }
    // mapVisualizeSvg.iterate(m, m.r[0], colorMode, shouldAnimationInit, editedPath)
  },
  // iterate: (m: M, n: N, colorMode: string, shouldAnimationInit: boolean, editedPath: any[]) => {
    // const conditions = resolveScope(n)
    // const {
    //   SELECTION_COLOR,
    //   TABLE_FRAME_COLOR,
    //   TABLE_GRID,
    //   TASK_LINE_1, TASK_LINE_2, TASK_LINE_3,
    //   TASK_FILL_1, TASK_FILL_2, TASK_FILL_3,
    //   TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE,
    //   TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE,
    //   TASK_LINE
    // } = getColors(colorMode)
    // if (conditions.branchFill) {
    //   updateMapSvgData(n.nodeId, 'branchFill', {
    //     path: getPolygonPath(n, getStructPolygonPoints('f', n), 'f', 0),
    //     fill: n.fFillColor,
    //   })
    // }
    // if (conditions.nodeFill) {
    //   let sFillColorOverride = ''
    //   if (n.taskStatus > 1) {
    //     sFillColorOverride = [TASK_FILL_1, TASK_FILL_2, TASK_FILL_3].at(n.taskStatus - 2) || ''
    //   }
    //   updateMapSvgData(n.nodeId, 'nodeFill', {
    //     path: getArcPath(n, -2, true),
    //     fill: sFillColorOverride === '' ? n.sFillColor : sFillColorOverride
    //   })
    // }
    // if (conditions.branchBorder) {
    //   updateMapSvgData(n.nodeId, 'branchBorder', {
    //     path: getPolygonPath(n, getStructPolygonPoints('f', n), 'f', 0),
    //     stroke: n.fBorderColor,
    //     strokeWidth: n.fBorderWidth,
    //   })
    // }
    // if (conditions.nodeBorder) {
    //   updateMapSvgData(n.nodeId, 'nodeBorder', {
    //     path: getArcPath(n, -2, true),
    //     stroke: n.sBorderColor,
    //     strokeWidth: n.sBorderWidth,
    //   })
    // }
    // if (conditions.selectionBorder && !isEqual(n.path, m.g.sc.lastPath)) {
    //   updateMapSvgData(n.nodeId, 'selectionBorder', {
    //     path: getPolygonPath(n, getStructPolygonPoints(n.selection, n), n.selection, 0),
    //     stroke: SELECTION_COLOR,
    //     strokeWidth: 1,
    //   })
    // }
    // if (conditions.line) {
      // let x1, y1, dx, dy, x2, y2
      // if (shouldAnimationInit && n.animationRequested) {
      //   x1 = dir === - 1 ? n.parentNodeStartXFrom : n.parentNodeEndXFrom
      //   y1 = n.parentNodeYFrom
      // } else {
      //   x1 = dir === - 1 ? n.parentNodeStartX : n.parentNodeEndX
      //   y1 = n.parentNodeY
      // }
      // x1 = isOdd(x1)?x1-0.5:x1
      // x2 = nsx
      // y2 = n.nodeY
      // dx=n.lineDeltaX
      // dy=n.lineDeltaY
      // let lineColorOverride = ''
      // if (n.taskStatus > 1) {
      //   lineColorOverride = [TASK_LINE_1, TASK_LINE_2, TASK_LINE_3].at(n.taskStatus - 2) || ''
      // }
      // updateMapSvgData(n.nodeId, 'line', {
      //   path: getLinePath(n, getLinePoints(n)),
      //   strokeWidth: n.lineWidth,
      //   stroke: lineColorOverride === ''
      //     ? n.lineColor
      //     : lineColorOverride
      // })
    // }
    // if (conditions.table) {
      // frame
      // updateMapSvgData(n.nodeId, 'tableFrame', {
      //   path: getArcPath(n, 0, false),
      //   stroke: n.sBorderColor === '' ? TABLE_FRAME_COLOR : n.sBorderColor,
      //   strokeWidth: n.sBorderWidth,
      // })
      // grid
      // let path = ''
      // let rowCount = Object.keys(n.c).length
      // for (let i = 1; i < rowCount; i++) {
      //   let x1 = n.nodeStartX
      //   let x2 = n.nodeEndX
      //   let y = nsy + n.sumMaxRowHeight[i]
      //   path += `M${x1},${y} L${x2},${y}`
      // }
      // let colCount = Object.keys(n.c[0]).length
      // for (let j = 1; j < colCount; j++) {
      //   let x = nsx + dir*n.sumMaxColWidth[j]
      //   path += `M${x},${nsy} L${x},${ney}`
      // }
      // updateMapSvgData(n.nodeId, 'tableGrid', {
      //   path: path,
      //   stroke: TABLE_GRID,
      //   strokeWidth: 1,
      // })
      // cell
      // tableLoops:
      //   for (let i = 0; i < rowCount; i++) {
      //     for (let j = 0; j < colCount; j++) {
      //       if (n.c[i][j].selected) {
      //         updateMapSvgData(n.nodeId, 'selectionBorder', {
      //           path: getPolygonPath(n, getCellPolygonPoints(m, n, i, j), 's', 4),
      //           stroke: SELECTION_COLOR,
      //           strokeWidth: 1,
      //         })
      //         break tableLoops
      //       }
      //     }
      //   }
    // }
    // if (conditions.task) {
      // const {mapWidth, margin, taskConfigN, taskConfigD, taskConfigGap, taskConfigWidth} = m.g
      // let startX
      // if (n.path.includes('c')) {
      //   let coverCellPath = n.path.slice(0, n.path.lastIndexOf('c'))
      //   let currCol = n.path[n.path.lastIndexOf('c') + 2]
      //   let coverCellRef = getMapData(m, coverCellPath)
      //   let smcv = coverCellRef.sumMaxColWidth[currCol]
      //   let mcv = coverCellRef.maxColWidth[currCol]
      //   startX = dir === - 1
      //     ? coverCellRef.nodeEndX - smcv - mcv + 120
      //     : coverCellRef.nodeStartX + smcv + mcv - 120
      // } else {
      //   startX = dir === - 1
      //     ? margin + taskConfigWidth
      //     : mapWidth - taskConfigWidth - margin
      // }
      // let x1 = nex
      // let x2 = startX
      // let y = n.nodeY
      // if (!isEqual(n.path, editedPath)) {
      //   updateMapSvgData(n.nodeId, 'taskLine', {
      //     path: `M${x1},${y} L${x2},${y}`,
      //     stroke: TASK_LINE,
      //     strokeWidth: 1,
      //   })
      // }

      // for (let i = 0; i < taskConfigN; i++) {
      //   const cx = dir === - 1
      //     ? startX - taskConfigD/2 - i * (taskConfigD + taskConfigGap)
      //     : startX + taskConfigD/2 + i * (taskConfigD + taskConfigGap)
      //   const cy = n.nodeY
      //   const r = taskConfigD / 2
      //   const fill = n.taskStatus === i + 1
      //     ? [TASK_CIRCLE_0_ACTIVE, TASK_CIRCLE_1_ACTIVE, TASK_CIRCLE_2_ACTIVE, TASK_CIRCLE_3_ACTIVE].at(i)
      //     : [TASK_CIRCLE_0_INACTIVE, TASK_CIRCLE_1_INACTIVE, TASK_CIRCLE_2_INACTIVE, TASK_CIRCLE_3_INACTIVE].at(i)
      //
      //
      //
      //   updateMapSvgData(n.nodeId, `taskCircle${i + 1}`, { cx, cy, r, fill })
      // }
    // }
  //   n.d.map(i => mapVisualizeSvg.iterate(m, i, colorMode, shouldAnimationInit, editedPath))
  //   n.s.map(i => mapVisualizeSvg.iterate(m, i, colorMode, shouldAnimationInit, editedPath))
  //   n.c.map(i => i.map(j => mapVisualizeSvg.iterate(m, j, colorMode, shouldAnimationInit, editedPath)))
  // }
}
