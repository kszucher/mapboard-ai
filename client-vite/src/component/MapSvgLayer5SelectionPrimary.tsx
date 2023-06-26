import React, {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "./Colors"
import {getG, getX, isXACC, isXACR, isXC} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const nx = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {
        !selectionRectCoords.length &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(nx, (isXC(m) || isXACR(m) || isXACC(m)) ? getPolygonC(m) : getPolygonS(m, nx, nx.selection), nx.selection, getSelectionMargin(m, nx))}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}
          {...pathCommonProps}
        >
        </path>
      }
    </g>
  )
}
