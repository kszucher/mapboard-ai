import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../api/Api.ts"
import {getColors} from "../consts/Colors.ts"
import {getG, getAXR, getXR, isAXR,} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../editorMutations/EditorMutations.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";

export const MapSvgRSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    isAXR(m) && getAXR(m).length === 1 && !selectionRectCoords.length &&
    <Fragment>
      <path
        key={`${g.nodeId}_svg_selectionBorderPrimary`}
        stroke={C.SELECTION_COLOR}
        strokeWidth={1}
        fill={'none'}{...pathCommonProps}
        d={getPolygonPath(m, getXR(m), 'sSelf', -2)}
      />
    </Fragment>
  )
}
