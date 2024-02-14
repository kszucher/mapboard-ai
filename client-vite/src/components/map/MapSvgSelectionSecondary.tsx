import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getXA, isXR, isXS, mT} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {MapMode} from "../../state/Enums.ts"

export const MapSvgSelectionSecondary: FC = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mapMode !== MapMode.VIEW &&
    mT(m).map(ti => (
      <Fragment key={ti.nodeId}>
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 && isXR(m) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', -2)}/>
        }
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 &&isXS(m) && (ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || ti.co1.length) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', 4)}/>
        }
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 && isXS(m) && !(ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || ti.co1.length) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', -2)}/>
        }
      </Fragment>
    ))
  )
}
