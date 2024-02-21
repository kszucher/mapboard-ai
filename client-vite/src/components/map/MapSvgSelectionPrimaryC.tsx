import {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXS, isXACC, isXACR, isXC} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSelectionPrimaryC: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    !selectionRectCoords.length && (isXC(m) || isXACR(m) || isXACC(m)) &&
    <path
      key={`${g.nodeId}_svg_selectionBorderPrimary`}
      stroke={C.SELECTION_COLOR}
      strokeWidth={1}
      fill={'none'}{...pathCommonProps}
      d={getPolygonPath(m, xs, 'c', 4)}
    />
  )
}
