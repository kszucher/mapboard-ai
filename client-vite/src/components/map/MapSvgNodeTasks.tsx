import {FC, Fragment} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {MRT} from "../../reducers/MapReducerTypes.ts"
import {adjust} from "../../utils/Utils"
import {TASK_CIRCLES_GAP} from "../../state/Consts"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getCountTSO1, getG, mTS} from "../../selectors/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getLinearLinePath, getTaskRadius, getTaskStartPoint, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeTasks: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  return (
    mTS(m).map(ti => (
      <Fragment key={ti.nodeId}>
        {ti.taskStatus > 0 && getCountTSO1(m, ti) === 0 && getCountTCO1(m, ti) === 0 && ti.contentType !== 'image' && !isEqual(ti.nodeId, editedNodeId) &&
          <path
            d={
              getLinearLinePath({
                x1: adjust(ti.nodeStartX + ti.selfW),
                x2: adjust(getTaskStartPoint(m, g, ti)),
                y1: adjust(ti.nodeStartY + ti.selfH / 2),
                y2: adjust(ti.nodeStartY + ti.selfH / 2)
              })
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
            cy={ti.nodeStartY + ti.selfH / 2}
            r={getTaskRadius(g) / 2}
            fill={ti.taskStatus === i + 1
              ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
              : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
            vectorEffect={'non-scaling-stroke'}
            style={{transition: '0.3s ease-out'}}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dispatch(actions.mapAction({type: MRT.setTaskStatus, payload: {taskStatus: i + 1, nodeId: ti.nodeId}}))
            }}
          />
        ))}
      </Fragment>
    ))
  )
}
