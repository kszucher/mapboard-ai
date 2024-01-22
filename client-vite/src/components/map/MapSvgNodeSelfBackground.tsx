import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {mT} from "../../queries/MapQueries.ts"
import {getColors} from "../assets/Colors"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getArcPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeSelfBackground: FC = () => {
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
        {...pathCommonProps}
      />
    )
  )
}
