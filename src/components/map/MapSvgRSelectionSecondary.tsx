import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../colors/Colors.ts"
import {getAXR, mR} from "../../mapQueries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/ApiState.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

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
