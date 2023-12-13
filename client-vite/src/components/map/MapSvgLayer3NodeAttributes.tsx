import {FC} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {adjust} from "../../utils/Utils"
import {TASK_CIRCLES_GAP} from "../../state/Consts"
import {getColors} from "../assets/Colors"
import {getTSI1, getTSI2, getCountTCO1, getCountTSO1, getG, getNodeById, mTS, mTC, getPathPattern} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector, pmSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
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
      {mTS(m).map(ti => (
        <g key={ti.nodeId}>
          {ti.fBorderColor &&
            <path
              d={getPolygonPath(ti, getPolygonS(m, ti, 'f'), 'f', 0)}
              stroke={ti.fBorderColor}
              strokeWidth={ti.fBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {ti.sBorderColor && getCountTCO1(m, ti) === 0 &&
            <path
              d={getArcPath(ti, -2, true)}
              stroke={ti.sBorderColor}
              strokeWidth={ti.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {!getPathPattern(ti.path).endsWith('cs') && getCountTCO1(m, ti) === 0 &&
            <path
              d={!getNodeById(pm, ti.nodeId) && getTSI1(pm, ti)
                ? getLinePathBetweenNodes(getTSI1(pm, ti), ti)
                : getLinePathBetweenNodes(getTSI1(m, ti), ti)
              }
              strokeWidth={ti.lineWidth}
              stroke={ti.taskStatus > 1
                ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(ti.taskStatus - 2)
                : ti.lineColor
              }
              fill={'none'}
              {...pathCommonProps}
            >
              {
                !getNodeById(pm, ti.nodeId) && getTSI1(pm, ti) &&
                <animate
                  attributeName='d'
                  from={getLinePathBetweenNodes(getTSI1(pm, ti), ti)}
                  to={getLinePathBetweenNodes(getTSI1(m, ti), ti)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                />
              }
            </path>
          }
          {getCountTCO1(m, ti) > 0 &&
            <path
              d={getArcPath(ti, 0, false)}
              stroke={ti.sBorderColor ? ti.sBorderColor : C.TABLE_FRAME_COLOR}
              strokeWidth={ti.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {getCountTCO1(m, ti) > 0 &&
            <path
              d={getGridPath(ti)}
              stroke={C.TABLE_GRID}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {ti.taskStatus > 0 && getCountTSO1(m, ti) === 0 && getCountTCO1(m, ti) === 0 && ti.contentType !== 'image' && !isEqual(ti.nodeId, editedNodeId) &&
            <path
              d={getLinearLinePath({
                x1: adjust(ti.nodeEndX),
                x2: adjust(getTaskStartPoint(m, g, ti)),
                y: adjust(ti.nodeY)})
              }
              stroke={C.TASK_LINE}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            />
          }
          {ti.taskStatus > 0 && getCountTSO1(m, ti) === 0 && getCountTCO1(m, ti) === 0 && ti.contentType !== 'image' && [...Array(4)].map((_, i) => (
            <circle
              key={`${ti.nodeId}_svg_taskCircle${i + 1}`}
              id={'taskCircle'}
              cx={getTaskStartPoint(m, g, ti) + getTaskRadius(g) / 2 + i * (getTaskRadius(g) + TASK_CIRCLES_GAP)}
              cy={ti.nodeY}
              r={getTaskRadius(g) / 2}
              fill={ti.taskStatus === i + 1
                ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
                : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
              vectorEffect={'non-scaling-stroke'}
              style={{transition: '0.3s ease-out'}}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dispatch(actions.mapAction({type: 'setTaskStatus', payload: {taskStatus: i + 1, nodeId: ti.nodeId}}))
              }}
            />
          ))}
        </g>
      ))}
      {mTC(m).map(ti => (
        <g key={ti.nodeId}>
          {!getPathPattern(ti.path).endsWith('csc') && ti.path.at(-2) > -1 && ti.path.at(-1) === 0 &&
            <path
              d={!getNodeById(pm, ti.nodeId) && getTSI2(pm, ti)
                ? getLinePathBetweenNodes(getTSI2(pm, ti), ti)
                : getLinePathBetweenNodes(getTSI2(m, ti), ti)
              }
              strokeWidth={ti.lineWidth}
              stroke={ti.lineColor}
              fill={'none'}
              {...pathCommonProps}
            >
              {!getNodeById(pm, ti.nodeId) && getTSI2(pm, ti) &&
                <animate
                  attributeName='d'
                  from={getLinePathBetweenNodes(getTSI2(pm, ti), ti)}
                  to={getLinePathBetweenNodes(getTSI2(m, ti), ti)}
                  dur={'0.3s'}
                  repeatCount={'once'}
                  fill={'freeze'}
                />
              }
            </path>
          }
        </g>
      ))}
    </g>
  )
}
