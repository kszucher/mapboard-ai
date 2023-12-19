import {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getG, getX, isXACC, isXACR, isXC, isXR, isXS} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {pathCommonProps} from "./MapSvg"
import {getPolygonPath} from "./MapSvgUtils"

export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const t = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {!selectionRectCoords.length && isXR(m) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', -2)}/>
      }
      {!selectionRectCoords.length && isXS(m) && t.selection === 's' && (t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', 4)}/>
      }
      {!selectionRectCoords.length && isXS(m) && t.selection === 's' && !((t.sBorderColor  || t.sFillColor) || t.taskStatus > 1 || getCountTCO1(m, t)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', -2)}/>
      }
      {!selectionRectCoords.length && isXS(m) && t.selection === 'f' &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sFamily', 4)}/>
      }
      {!selectionRectCoords.length && (isXC(m) || isXACR(m) || isXACC(m)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'c', 4)}/>
      }
    </g>
  )
}
