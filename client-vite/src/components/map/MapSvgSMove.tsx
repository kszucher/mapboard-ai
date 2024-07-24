import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import colors from "tailwindcss/colors"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../colors/Colors.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/ApiState.ts"
import {RootState} from "../../reducers/EditorReducer.ts"
import {getBezierLinePath, getBezierLinePoints} from "./MapSvgUtils"

export const MapSvgSMove: FC = () => {
  const sMoveCoords = useSelector((state: RootState) => state.editor.sMoveCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <Fragment>
      {sMoveCoords.length &&
        <path
          d={getBezierLinePath('M', getBezierLinePoints(sMoveCoords))}
          stroke={C.MOVE_LINE_COLOR}
          strokeWidth={1}
          fill={'none'}
        />
      }
      {sMoveCoords.length &&
        <rect
          x={sMoveCoords[2] - 10}
          y={sMoveCoords[3] - 10}
          width={20}
          height={20}
          rx={8}
          ry={8}
          fill={colorMode === 'dark' ? colors.zinc[800] : colors.zinc[50]}
          fillOpacity={1}
          stroke={C.MOVE_RECT_COLOR}
          strokeWidth={5}
        />
      }
    </Fragment>
  )
}
