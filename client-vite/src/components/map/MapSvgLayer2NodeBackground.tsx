import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {mT} from "../../selectors/MapSelector"
import {getColors} from "../assets/Colors"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import {getArcPath} from "./MapSvgUtils"

export const MapSvgLayer2NodeBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {mT(m).map((t: T) => (
        <Fragment key={t.nodeId}>
          {
            (t.sFillColor || t.taskStatus > 1) &&
            <path
              d={getArcPath(t, -2, true)}
              fill={t.taskStatus > 1 ? [C.TASK_FILL_1, C.TASK_FILL_2, C.TASK_FILL_3].at(t.taskStatus - 2) : t.sFillColor}
              {...pathCommonProps}
            >
            </path>
          }
        </Fragment>
      ))}
    </g>
  )
}
