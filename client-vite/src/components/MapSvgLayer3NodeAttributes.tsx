import React, {FC, Fragment,} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {adjust} from "../utils/Utils";
import {TASK_CIRCLES_GAP} from "../state/Consts"
import {getColors} from "./Colors"
import {getTSI1, getTSI2, getCountTCO1, getCountTSO1, getG, getNodeById, getPathDir, getPathPattern, isD, isR, isS, mT} from "../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector, pmSelector} from "../state/EditorState"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {T} from "../state/MapStateTypes"
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
      {mT(m).map((t: T) => (
        <Fragment key={t.nodeId}>
          {
            t.fBorderColor &&
            <path
              d={getPolygonPath(t, getPolygonS(m, t, 'f'), 'f', 0)}
              stroke={t.fBorderColor}
              strokeWidth={t.fBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {
            t.sBorderColor && getCountTCO1(m, t) === 0 &&
            <path
              d={getArcPath(t, -2, true)}
              stroke={t.sBorderColor}
              strokeWidth={t.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {(getPathPattern(t.path).endsWith('ds') && getCountTCO1(m, t) === 0 || (getPathPattern(t.path).endsWith('ss') && getCountTCO1(m, t) === 0)) &&
            <path
              d={!getNodeById(pm, t.nodeId) && getTSI1(pm, t) ? getLinePathBetweenNodes(getTSI1(pm, t), t) : getLinePathBetweenNodes(getTSI1(m, t), t)}
              strokeWidth={t.lineWidth}
              stroke={t.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(t.taskStatus - 2) : t.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, t.nodeId) && getTSI1(pm, t) &&
                <animate attributeName='d' from={getLinePathBetweenNodes(getTSI1(pm, t), t)} to={getLinePathBetweenNodes(getTSI1(m, t), t)} dur={'0.3s'} repeatCount={'once'} fill={'freeze'}/>
              }
            </path>
          }
          {((getPathPattern(t.path).endsWith('dsc') || getPathPattern(t.path).endsWith('ssc')) && t.path.at(-2) as number > -1 && t.path.at(-1) === 0) &&
            <path
              d={!getNodeById(pm, t.nodeId) && getTSI2(pm, t) ? getLinePathBetweenNodes(getTSI2(pm, t), t) : getLinePathBetweenNodes(getTSI2(m, t), t)}
              strokeWidth={t.lineWidth}
              stroke={t.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, t.nodeId) && getTSI2(pm, t) &&
                <animate attributeName='d' from={getLinePathBetweenNodes(getTSI2(pm, t), t)} to={getLinePathBetweenNodes(getTSI2(m, t), t)} dur={'0.3s'} repeatCount={'once'} fill={'freeze'}/>
              }
            </path>
          }
          {
            isS(t.path) && getCountTCO1(m, t) &&
            <path d={getArcPath(t, 0, false)} stroke={t.sBorderColor ? t.sBorderColor : C.TABLE_FRAME_COLOR} strokeWidth={t.sBorderWidth} fill={'none'} {...pathCommonProps}/>
          }
          {
            isS(t.path) && getCountTCO1(m, t) &&
            <path d={getGridPath(t)} stroke={C.TABLE_GRID} strokeWidth={1} fill={'none'} {...pathCommonProps}/>
          }
          {
            t.taskStatus > 0 && !isR(t.path) && !isD(t.path) && getCountTSO1(m, t) === 0 && getCountTCO1(m, t) === 0 && t.contentType !== 'image' &&
            <Fragment key={`${t.nodeId}_svg_task`}>
              {
                !isEqual(t.nodeId, editedNodeId) &&
                <path
                  d={getLinearLinePath({x1: adjust(getPathDir(t.path) === -1 ? t.nodeStartX : t.nodeEndX), x2: adjust(getTaskStartPoint(m, g, t)), y: adjust(t.nodeY)})}
                  stroke={C.TASK_LINE}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                />
              }
              {
                [...Array(4)].map((el, i) => (
                  <circle
                    key={`${t.nodeId}_svg_taskCircle${i + 1}`}
                    id={'taskCircle'}
                    cx={getTaskStartPoint(m, g, t) + getPathDir(t.path) * (getTaskRadius(g) / 2 + i * (getTaskRadius(g) + TASK_CIRCLES_GAP))}
                    cy={t.nodeY}
                    r={getTaskRadius(g) / 2}
                    fill={t.taskStatus === i + 1
                      ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
                      : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
                    vectorEffect={'non-scaling-stroke'}
                    style={{
                      transition: '0.3s ease-out'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      dispatch(actions.mapAction({type: 'setTaskStatus', payload: {taskStatus: i + 1, nodeId: t.nodeId}}))
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
