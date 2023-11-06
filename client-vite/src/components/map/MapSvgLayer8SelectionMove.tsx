import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../misc/Colors"
import {getG} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getBezierLinePath, getBezierLinePoints} from "./MapSvgUtils"

export const MapSvgLayer8SelectionMove: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const moveCoords = useSelector((state: RootState) => state.editor.moveCoords)
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {
        moveCoords.length &&
        <Fragment>
          <path
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
            fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
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
