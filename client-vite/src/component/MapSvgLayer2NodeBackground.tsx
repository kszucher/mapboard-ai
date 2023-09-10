import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../reducers/NodeApi"
import {getColors} from "./Colors"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../reducers/EditorReducer"
import {N} from "../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath} from "./MapSvgUtils"

export const MapSvgLayer2NodeBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            (n.sFillColor || n.taskStatus > 1) &&
            <path
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
