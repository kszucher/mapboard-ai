import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getX, isXS, mT} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgLayer4SelectionSecondary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {mT(m).map((t: T) => (
        <g key={t.nodeId}>
          {!selectionRectCoords.length && isXS(m) && t.selected && t.selected !== getX(m).selected && (t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
            <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', 4)}/>
          }
          {!selectionRectCoords.length && isXS(m) && t.selected && t.selected !== getX(m).selected && !(t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
            <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', -2)}/>
          }
        </g>
      ))}
    </g>
  )
}
