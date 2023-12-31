import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getG, getX, getXA, isXACC, isXACR, isXC, isXR, isXS} from "../../selectors/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const t = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <Fragment>
      {!selectionRectCoords.length && getXA(m).length === 1 && isXR(m) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', -2)}/>
      }
      {!selectionRectCoords.length && getXA(m).length === 1 && isXS(m) && t.selection === 's' && (t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', 4)}/>
      }
      {!selectionRectCoords.length && getXA(m).length === 1 && isXS(m) && t.selection === 's' && !((t.sBorderColor  || t.sFillColor) || t.taskStatus > 1 || getCountTCO1(m, t)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sSelf', -2)}/>
      }
      {!selectionRectCoords.length && getXA(m).length === 1 && isXS(m) && t.selection === 'f' &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'sFamily', 4)}/>
      }
      {!selectionRectCoords.length && getXA(m).length === 1 && (isXC(m) || isXACR(m) || isXACC(m)) &&
        <path key={`${g.nodeId}_svg_selectionBorderPrimary`} stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, t, 'c', 4)}/>
      }
    </Fragment>
  )
}
