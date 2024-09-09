import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../api/Api.ts"
import {getColors} from "../consts/Colors.ts"
import {getG, getXC, isAXC} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../editorMutations/EditorMutations.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";


export const MapSvgCSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xc = getXC(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    !selectionRectCoords.length && isAXC(m) &&
    <Fragment>
      <path
        key={`${g.nodeId}_svg_selectionBorderPrimary`}
        stroke={C.SELECTION_COLOR}
        strokeWidth={1}
        fill={'none'}{...pathCommonProps}
        d={getPolygonPath(m, xc, 'c', 4)}
      />
    </Fragment>
  )
}
