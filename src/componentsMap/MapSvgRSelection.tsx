import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../appStore/appStore.ts"
import {getColors} from "../consts/Colors.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getAXR, getG, getXR, isAXR, mR,} from "../mapQueries/MapQueries.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgRSelection: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xr = getXR(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  if (!selectionRectCoords.length && isAXR(m)) {
    if (getAXR(m).length === 1) {
      return (
        <path
          key={`${g.nodeId}_rsp`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
          d={getPolygonPath(xr, 'sSelf', -2)}
        />
      )
    } else if (getAXR(m).length > 1) {
      return mR(m).filter(ri => ri.selected).map(ri =>
        <path
          key={`${ri.nodeId}_rss`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
          d={getPolygonPath(ri, 'sSelf', -2)}
        />
      )
    }
  }
}
