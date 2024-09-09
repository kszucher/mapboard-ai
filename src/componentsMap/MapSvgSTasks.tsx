import {FC, Fragment} from "react"
import isEqual from "react-fast-compare"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {adjust} from "../utils/Utils.ts"
import {TASK_CIRCLES_GAP} from "../consts/Dimensions.ts"
import {getColors} from "../consts/Colors.ts"
import {getG, mS} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {getLinearLinePath, getTaskRadius, getTaskStartPoint, pathCommonProps} from "./MapSvgUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";

export const MapSvgSTasks: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MM, payload? : any) => dispatch(actions.mapReducer({type, payload}))
  return (
    mS(m).map(si => (
      <Fragment key={si.nodeId}>
        {si.taskStatus > 0 && si.so1.length === 0 && si.co1.length === 0 && si.contentType !== 'image' && !isEqual(si.nodeId, editedNodeId) &&
          <path
            d={
              getLinearLinePath({
                x1: adjust(si.nodeStartX + si.selfW),
                x2: adjust(getTaskStartPoint(m, g, si)),
                y1: adjust(si.nodeStartY + si.selfH / 2),
                y2: adjust(si.nodeStartY + si.selfH / 2)
              })
            }
            stroke={C.TASK_LINE}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
          />
        }
        {si.taskStatus > 0 && si.so1.length === 0 && si.co1.length === 0 && si.contentType !== 'image' && [...Array(4)].map((_, i) => (
          <circle
            key={`${si.nodeId}_svg_taskCircle${i + 1}`}
            id={'taskCircle'}
            cx={getTaskStartPoint(m, g, si) + getTaskRadius(g) / 2 + i * (getTaskRadius(g) + TASK_CIRCLES_GAP)}
            cy={si.nodeStartY + si.selfH / 2}
            r={getTaskRadius(g) / 2}
            fill={si.taskStatus === i + 1
              ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
              : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
            vectorEffect={'non-scaling-stroke'}
            style={{transition: '0.3s ease-out'}}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dm(MM.setTaskStatus, {taskStatus: i + 1, nodeId: si.nodeId})
            }}
          />
        ))}
      </Fragment>
    ))
  )
}
