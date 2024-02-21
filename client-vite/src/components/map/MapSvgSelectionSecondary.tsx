import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getXA, mR, mS} from "../../queries/MapQueries.ts"
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
    <Fragment>
      {mR(m).map(ri => (
        <Fragment key={ri.nodeId}>
          {!selectionRectCoords.length && ri.selected && getXA(m).length > 1 &&
            <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ri, 'sSelf', -2)}/>
          }
        </Fragment>
      ))}
      {mS(m).map(si => (
        <Fragment key={si.nodeId}>
          {!selectionRectCoords.length && si.selected && getXA(m).length > 1 && (si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) &&
            <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, si, 'sSelf', 4)}/>
          }
          {!selectionRectCoords.length && si.selected && getXA(m).length > 1 && !(si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) &&
            <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, si, 'sSelf', -2)}/>
          }
        </Fragment>
      ))}
    </Fragment>
  )
}
