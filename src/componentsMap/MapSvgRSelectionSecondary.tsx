import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {getColors} from "../consts/Colors.ts"
import {getAXR, mR} from "../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../editorMutations/EditorMutations.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"

export const MapSvgRSelectionSecondary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mR(m).map(ri => (
      <Fragment key={ri.nodeId}>
        {!selectionRectCoords.length && getAXR(m).length > 1 && ri.selected &&
          <path stroke={C.SELECTION_COLOR} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ri, 'sSelf', -2)}/>
        }
      </Fragment>
    ))
  )
}
