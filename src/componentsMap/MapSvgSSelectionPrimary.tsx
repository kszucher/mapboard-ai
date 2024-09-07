import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../api/Api.ts"
import {getColors} from "../componentsColors/Colors.ts"
import {getG, getAXS, getXS, isAXS} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState.ts"
import {mSelector} from "../state/EditorState.ts"
import {RootState} from "../reducers/EditorReducer.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    isAXS(m) && getAXS(m).length === 1 && !selectionRectCoords.length &&
    <Fragment>
      {xs.selection === 's' && (xs.sBorderColor || xs.sFillColor || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', 2)}
        />
      }
      {xs.selection === 's' && !((xs.sBorderColor || xs.sFillColor) || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', -2)}
        />
      }
      {xs.selection === 'f' &&
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
