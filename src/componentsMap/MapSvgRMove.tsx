import {FC} from "react"
import {useSelector} from "react-redux"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {getColors} from "../consts/Colors.ts"
import {RootState, useOpenWorkspaceQuery} from "../rootComponent/RootComponent.tsx"

export const MapSvgRMove: FC = () => {
  const rOffsetCoords = useSelector((state: RootState) => state.editor.rOffsetCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    rOffsetCoords.length &&
    <rect
      x={rOffsetCoords[0]}
      y={rOffsetCoords[1]}
      width={rOffsetCoords[2]}
      height={rOffsetCoords[3]}
      rx={8}
      ry={8}
      fill={"none"}
      fillOpacity={1}
      stroke={C.SELECTION_RECT_COLOR}
      strokeWidth={1}
    />
  )
}
