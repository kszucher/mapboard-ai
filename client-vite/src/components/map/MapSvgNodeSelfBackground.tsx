import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {mT} from "../../queries/MapQueries.ts"
import {getColors} from "../assets/Colors"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getArcPath} from "./MapSvgUtils"
import {LeftMouseMode} from "../../state/Enums.ts"

export const MapSvgNodeSelfBackground: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mT(m).map(ti => (ti.sFillColor || ti.taskStatus > 1) &&
      <path
        key={`${ti.nodeId}_sFillColor`}
        d={getArcPath(ti, -2, true)}
        fill={ti.taskStatus > 1 ? [C.TASK_FILL_1, C.TASK_FILL_2, C.TASK_FILL_3].at(ti.taskStatus - 2) : ti.sFillColor}
        {...{vectorEffect: 'non-scaling-stroke'}}
        style={{
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          transitionProperty: 'd, fill, stroke-width',
          pointerEvents: [LeftMouseMode.CLICK_SELECT_STRUCT, LeftMouseMode.CLICK_SELECT_AND_MOVE_STRUCT].includes(leftMouseMode) ? 'auto' : 'none'
        }}
      />
    )
  )
}
