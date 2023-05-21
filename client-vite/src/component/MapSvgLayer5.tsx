import React, {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getColors} from "../core/Colors"
import {getG, getX, isCCXA, isCRXA, isCX} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer5: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const x = getX(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g id="layer5">
      {
        !selectionRectCoords.length &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          d={getPolygonPath(x, (isCX(m) || isCRXA(m) || isCCXA(m)) ? getPolygonC(m) : getPolygonS(m, x, x.selection), x.selection, getSelectionMargin(m, x))}
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
