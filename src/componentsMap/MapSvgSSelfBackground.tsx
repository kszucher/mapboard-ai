import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {mS} from "../mapQueries/MapQueries.ts"
import {getColors} from "../componentsColors/Colors.ts"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState.ts"
import {mSelector} from "../state/EditorState.ts"
import {RootState} from "../reducers/EditorReducer.ts"
import {getArcPath} from "./MapSvgUtils.ts"

export const MapSvgSelfBackgroundS: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mS(m).map(si => (si.sFillColor || si.taskStatus > 1) &&
      <path
        key={`${si.nodeId}_sFillColor`}
        d={getArcPath(si, -2, true)}
        fill={si.taskStatus > 1 ? [C.TASK_FILL_1, C.TASK_FILL_2, C.TASK_FILL_3].at(si.taskStatus - 2) : si.sFillColor}
        vectorEffect={'non-scaling-stroke'}
        style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'd, fill, stroke-width'}}
      />
    )
  )
}
