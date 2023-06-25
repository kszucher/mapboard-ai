import React, {FC, } from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "./Colors"
import {getG} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"

export const MapSvgLayer0MapBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      <rect
        key={`${g.nodeId}_svg_backgroundRect`}
        x={0}
        y={0}
        width={g.mapWidth}
        height={g.mapHeight}
        rx={32}
        ry={32}
        fill={C.MAP_BACKGROUND}
        style={{transition: '0.3s ease-out'}}
      >
      </rect>
    </g>
  )
}
