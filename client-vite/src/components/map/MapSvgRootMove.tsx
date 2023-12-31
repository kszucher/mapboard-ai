import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {RootState} from "../../reducers/EditorReducer"

export const MapSvgRootMove: FC = () => {
  const rOffsetCoords = useSelector((state: RootState) => state.editor.rOffsetCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <Fragment>
      {rOffsetCoords.length &&
        <rect
          x={rOffsetCoords[0]}
          y={rOffsetCoords[1]}
          width={rOffsetCoords[2]}
          height={rOffsetCoords[3]}
          rx={8}
          ry={8}
          fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
          fillOpacity={1}
          stroke={C.SELECTION_RECT_COLOR}
          strokeWidth={5}
        />
      }
    </Fragment>
  )
}
