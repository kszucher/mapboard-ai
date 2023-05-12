import React, {FC, Fragment,} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "../core/Colors"
import {getClosestStructParentPath, getCountD, getCountSC, getCountSS, getG, getNodeById, getNodeByPath, getPathPattern, isS} from "../map/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../editor/EditorReducer"
import {N} from "../state/MapPropTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath, getGridPath, getLinePathBetweenNodes, getPolygonPath, getStructPolygonPoints, getTaskCircle, getTaskPath} from "./MapSvgUtils"

export const MapSvgLayer3: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const pm = mapListIndex > 0 ? mapList[mapListIndex - 1] : m // TODO ---> instead of this TERNARY, use mapListIndexBefore (TODO)
  const g = getG(m)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g id="layer3">
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            n.fBorderColor &&
            <path
              key={`${n.nodeId}_svg_branchBorder`}
              d={getPolygonPath(n, getStructPolygonPoints(n, 'f'), 'f', 0)}
              stroke={n.fBorderColor}
              strokeWidth={n.fBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            n.sBorderColor && !getCountSC(m, n.path) &&
            <path
              key={`${n.nodeId}_svg_nodeBorder`}
              d={getArcPath(n, -2, true)}
              stroke={n.sBorderColor}
              strokeWidth={n.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {(
              getPathPattern(n.path).endsWith('ds') ||
              (getPathPattern(n.path).endsWith('ss') && !getCountSC(m, n.path)) ||
              (getPathPattern(n.path).endsWith('dsc') || getPathPattern(n.path).endsWith('ssc')) && n.path.at(-2) as number > -1 && n.path.at(-1) === 0
            ) &&
            <path
              key={`${n.nodeId}_svg_line`}
              d={
                !getNodeById(pm, n.nodeId) && getNodeByPath(pm, getClosestStructParentPath(n.path))
                  ? getLinePathBetweenNodes(getNodeByPath(pm, getClosestStructParentPath(n.path)), n)
                  : getLinePathBetweenNodes(getNodeByPath(m, getClosestStructParentPath(n.path)), n)
              }
              strokeWidth={n.lineWidth}
              stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, n.nodeId) && getNodeByPath(pm, getClosestStructParentPath(n.path)) &&
                <animate
                  attributeName='d'
                  from={getLinePathBetweenNodes(getNodeByPath(pm, getClosestStructParentPath(n.path)), n)}
                  to={getLinePathBetweenNodes(getNodeByPath(m, getClosestStructParentPath(n.path)), n)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                >
                </animate>
              }
            </path>
          }
          {
            isS(n.path) && getCountSC(m, n.path) &&
            <path
              key={`${n.nodeId}_svg_tableFrame`}
              d={getArcPath(n, 0, false)}
              stroke={n.sBorderColor ? n.sBorderColor : C.TABLE_FRAME_COLOR}
              strokeWidth={n.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            isS(n.path) && getCountSC(m, n.path) &&
            <path
              key={`${n.nodeId}_svg_tableGrid`}
              d={getGridPath(n)}
              stroke={C.TABLE_GRID}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            n.taskStatus > 0 && !getCountD(m, n.path) && !getCountSS(m, n.path) && !getCountSC(m, n.path) && n.contentType !== 'image' &&
            <Fragment key={`${n.nodeId}_svg_task`}>
              {
                !isEqual(n.nodeId, editedNodeId) &&
                <path
                  key={`${n.nodeId}_svg_taskLine`}
                  d={getTaskPath(m, g, n)}
                  stroke={C.TASK_LINE}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                [...Array(g.taskConfigN)].map((el, i) => (
                  <circle
                    key={`${n.nodeId}_svg_taskCircle${i + 1}`}
                    id={'taskCircle'}
                    {...getTaskCircle(m, g, n, i)}
                    fill={n.taskStatus === i + 1
                      ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
                      : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
                    vectorEffect={'non-scaling-stroke'}
                    style={{
                      transition: '0.3s ease-out'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      dispatch(actions.mapAction({type: 'setTaskStatus', payload: { taskStatus: i + 1, nodeId: n.nodeId }}))}
                    }
                  >
                  </circle>
                ))
              }
            </Fragment>
          }
        </Fragment>
      ))}
    </g>
  )
}
