import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {getColors} from "../consts/Colors.ts"
import {RootState} from "../editorMutations/EditorReducer.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"

export const MapSvgSSelectionArea: FC = () => {
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
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
    />
  )
}
