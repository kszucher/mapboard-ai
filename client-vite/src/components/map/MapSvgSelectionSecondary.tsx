import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../assets/Colors"
import {getCountTCO1, getXA, isXR, isXS, mT} from "../../selectors/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSelectionSecondary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mT(m).map(ti => (
      <Fragment key={ti.nodeId}>
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 && isXR(m) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', -2)}/>
        }
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 &&isXS(m) && (ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || getCountTCO1(m, ti)) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', 4)}/>
        }
        {!selectionRectCoords.length && ti.selected && getXA(m).length > 1 && isXS(m) && !(ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || getCountTCO1(m, ti)) &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', -2)}/>
        }
      </Fragment>
    ))
  )
}
