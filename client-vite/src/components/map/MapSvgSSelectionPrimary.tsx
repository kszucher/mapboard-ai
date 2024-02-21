import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXA, getXS, isXS} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    isXS(m) && !selectionRectCoords.length &&
    <Fragment>
      {getXA(m).length === 1 && xs.selection === 's' && (xs.sBorderColor || xs.sFillColor || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', 4)}
        />
      }
      {getXA(m).length === 1 && xs.selection === 's' && !((xs.sBorderColor || xs.sFillColor) || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', -2)}
        />
      }
      {getXA(m).length === 1 && xs.selection === 'f' &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sFamily', 4)}
        />
      }
    </Fragment>
  )
}
