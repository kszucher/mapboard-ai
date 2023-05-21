import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "../core/Colors"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {N} from "../state/MapPropTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath} from "./MapSvgUtils"

export const MapSvgLayer2: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g id="layer2">
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            (n.sFillColor || n.taskStatus > 1) &&
            <path
              key={`${n.nodeId}_svg_nodeFill`}
              d={getArcPath(n, -2, true)}
              fill={n.taskStatus > 1 ? [C.TASK_FILL_1, C.TASK_FILL_2, C.TASK_FILL_3].at(n.taskStatus - 2) : n.sFillColor}
              {...pathCommonProps}
            >
            </path>
          }
        </Fragment>
      ))}
    </g>
  )
}
