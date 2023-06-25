import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "./Colors"
import {getG} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {getBezierLinePath, getBezierLinePoints} from "./MapSvgUtils"

export const MapSvgLayer8: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const moveCoords = useSelector((state: RootState) => state.editor.moveCoords)
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g id="layer8">
      {
        moveCoords.length &&
        <Fragment>
          <path
            key={`${g.nodeId}_svg_moveLine`}
            d={getBezierLinePath('M', getBezierLinePoints(moveCoords))}
            stroke={C.MOVE_LINE_COLOR}
            strokeWidth={1}
            fill={'none'}
          >
          </path>
          <rect
            x={moveCoords[2] - 10}
            y={moveCoords[3] - 10}
            width={20}
            height={20}
            rx={8}
            ry={8}
            fill={C.MAP_BACKGROUND}
            fillOpacity={1}
            stroke={C.MOVE_RECT_COLOR}
            strokeWidth={5}
          >
          </rect>
        </Fragment>
      }
    </g>
  )
}
