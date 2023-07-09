import React, {FC, Fragment,} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {mapActionResolver} from "../core/MapActionResolver"
import {getColors} from "./Colors"
import {getClosestStructParentPath, getCountCO1, getCountSO1, getG, getNodeById, getNodeByPath, getPathPattern, isD, isR, isS} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector, pmSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {N} from "../state/MapPropTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath, getGridPath, getLinePathBetweenNodes, getPolygonPath, getPolygonS, getTaskCircle, getTaskPath} from "./MapSvgUtils"

export const MapSvgLayer3NodeAttributes: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const pm = useSelector((state:RootState) => pmSelector(state))
  const g = getG(m)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            n.fBorderColor &&
            <path
              d={getPolygonPath(n, getPolygonS(m, n, 'f'), 'f', 0)}
              stroke={n.fBorderColor}
              strokeWidth={n.fBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            n.sBorderColor && !getCountCO1(m, n.path) &&
            <path
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
              (getPathPattern(n.path).endsWith('ss') && !getCountCO1(m, n.path)) ||
              (getPathPattern(n.path).endsWith('dsc') || getPathPattern(n.path).endsWith('ssc')) && n.path.at(-2) as number > -1 && n.path.at(-1) === 0
            ) &&
            <path
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
            isS(n.path) && getCountCO1(m, n.path) &&
            <path
              d={getArcPath(n, 0, false)}
              stroke={n.sBorderColor ? n.sBorderColor : C.TABLE_FRAME_COLOR}
              strokeWidth={n.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            isS(n.path) && getCountCO1(m, n.path) &&
            <path
              d={getGridPath(n)}
              stroke={C.TABLE_GRID}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
          {
            n.taskStatus > 0 && !isR(n.path) && !isD(n.path) && !getCountSO1(m, n.path) && !getCountCO1(m, n.path) && n.contentType !== 'image' &&
            <Fragment key={`${n.nodeId}_svg_task`}>
              {
                !isEqual(n.nodeId, editedNodeId) &&
                <path
                  d={getTaskPath(m, g, n)}
                  stroke={C.TASK_LINE}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                [...Array(4)].map((el, i) => (
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
                      dispatch(actions.mapAction(mapActionResolver(m, e, 'c', 'setTaskStatus', { taskStatus: i + 1, nodeId: n.nodeId })))
                   }}>
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
