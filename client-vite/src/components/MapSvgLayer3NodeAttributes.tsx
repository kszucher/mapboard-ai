import React, {FC, Fragment,} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {adjust} from "../reducers/Utils";
import {TASK_CIRCLES_GAP} from "../state/Consts"
import {getColors} from "./Colors"
import {getNSI1, getNSI2, getCountNCO1, getCountNSO1, getG, getNodeById, getPathDir, getPathPattern, isD, isR, isS} from "../selectors/MapSelectorUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector, pmSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {N} from "../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath, getGridPath, getLinearLinePath, getLinePathBetweenNodes, getPolygonPath, getPolygonS, getTaskRadius, getTaskStartPoint} from "./MapSvgUtils"

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
            />
          }
          {
            n.sBorderColor && getCountNCO1(m, n) === 0 &&
            <path
              d={getArcPath(n, -2, true)}
              stroke={n.sBorderColor}
              strokeWidth={n.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {(getPathPattern(n.path).endsWith('ds') && getCountNCO1(m, n) === 0 || (getPathPattern(n.path).endsWith('ss') && getCountNCO1(m, n) === 0)) &&
            <path
              d={!getNodeById(pm, n.nodeId) && getNSI1(pm, n) ? getLinePathBetweenNodes(getNSI1(pm, n), n) : getLinePathBetweenNodes(getNSI1(m, n), n)}
              strokeWidth={n.lineWidth}
              stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, n.nodeId) && getNSI1(pm, n) &&
                <animate attributeName='d' from={getLinePathBetweenNodes(getNSI1(pm, n), n)} to={getLinePathBetweenNodes(getNSI1(m, n), n)} dur={'0.3s'} repeatCount={'once'} fill={'freeze'}/>
              }
            </path>
          }
          {((getPathPattern(n.path).endsWith('dsc') || getPathPattern(n.path).endsWith('ssc')) && n.path.at(-2) as number > -1 && n.path.at(-1) === 0) &&
            <path
              d={!getNodeById(pm, n.nodeId) && getNSI2(pm, n) ? getLinePathBetweenNodes(getNSI2(pm, n), n) : getLinePathBetweenNodes(getNSI2(m, n), n)}
              strokeWidth={n.lineWidth}
              stroke={n.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, n.nodeId) && getNSI2(pm, n) &&
                <animate attributeName='d' from={getLinePathBetweenNodes(getNSI2(pm, n), n)} to={getLinePathBetweenNodes(getNSI2(m, n), n)} dur={'0.3s'} repeatCount={'once'} fill={'freeze'}/>
              }
            </path>
          }
          {
            isS(n.path) && getCountNCO1(m, n) &&
            <path d={getArcPath(n, 0, false)} stroke={n.sBorderColor ? n.sBorderColor : C.TABLE_FRAME_COLOR} strokeWidth={n.sBorderWidth} fill={'none'} {...pathCommonProps}/>
          }
          {
            isS(n.path) && getCountNCO1(m, n) &&
            <path d={getGridPath(n)} stroke={C.TABLE_GRID} strokeWidth={1} fill={'none'} {...pathCommonProps}/>
          }
          {
            n.taskStatus > 0 && !isR(n.path) && !isD(n.path) && getCountNSO1(m, n) === 0 && getCountNCO1(m, n) === 0 && n.contentType !== 'image' &&
            <Fragment key={`${n.nodeId}_svg_task`}>
              {
                !isEqual(n.nodeId, editedNodeId) &&
                <path
                  d={getLinearLinePath({x1: adjust(getPathDir(n.path) === -1 ? n.nodeStartX : n.nodeEndX), x2: adjust(getTaskStartPoint(m, g, n)), y: adjust(n.nodeY)})}
                  stroke={C.TASK_LINE}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                />
              }
              {
                [...Array(4)].map((el, i) => (
                  <circle
                    key={`${n.nodeId}_svg_taskCircle${i + 1}`}
                    id={'taskCircle'}
                    cx={getTaskStartPoint(m, g, n) + getPathDir(n.path) * (getTaskRadius(g) / 2 + i * (getTaskRadius(g) + TASK_CIRCLES_GAP))}
                    cy={n.nodeY}
                    r={getTaskRadius(g) / 2}
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
                      dispatch(actions.mapAction({type: 'setTaskStatus', payload: {taskStatus: i + 1, nodeId: n.nodeId}}))
                    }}
                  />
                ))
              }
            </Fragment>
          }
        </Fragment>
      ))}
    </g>
  )
}
