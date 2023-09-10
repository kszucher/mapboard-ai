import React, {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {getColors} from "./Colors"
import {RootState} from "../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

export const MapSvgLayer7SelectionArea: FC = () => {
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {
        selectionRectCoords.length &&
        <rect
          x={selectionRectCoords[0]}
          y={selectionRectCoords[1]}
          width={selectionRectCoords[2]}
          height={selectionRectCoords[3]}
          rx={8}
          ry={8}
          fill={C.SELECTION_RECT_COLOR}
          fillOpacity={0.05}
          strokeWidth={2}
        >
        </rect>
      }
    </g>
  )
}
