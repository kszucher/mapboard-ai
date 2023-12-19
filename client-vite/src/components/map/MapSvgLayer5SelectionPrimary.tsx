import {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getG, getX, isXACC, isXACR, isXC, isXR, isXS} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonSelf, getPolygonFamily} from "./MapSvgUtils"

export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const x = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {!selectionRectCoords.length && isXR(m) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(x, getPolygonSelf(x), 's', -2)}/>
      }
      {!selectionRectCoords.length && isXS(m) && x.selection === 's' && (x.sBorderColor || x.sFillColor || x.taskStatus > 1 || getCountTCO1(m, x)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(x, getPolygonSelf(x), 's', 4)}/>
      }
      {!selectionRectCoords.length && isXS(m) && x.selection === 's' && !((x.sBorderColor  || x.sFillColor) || x.taskStatus > 1 || getCountTCO1(m, x)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(x, getPolygonSelf(x), 's', -2)}/>
      }
      {!selectionRectCoords.length && isXS(m) && x.selection === 'f' &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(x, getPolygonFamily(m, x), 'f', 4)}/>
      }
      {!selectionRectCoords.length && (isXC(m) || isXACR(m) || isXACC(m)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(x, getPolygonC(m), 's', 4)}/>
      }
    </g>
  )
}
