import React, {FC} from "react"
import {useSelector} from "react-redux";
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "../core/Colors"
import {RootState} from "../editor/EditorReducer";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const MapSvgLayer7: FC = () => {
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g id="layer7">
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
