import React, {FC} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../apis/NodeApi"
import {getColors} from "./Colors"
import {getG, getX, isXACC, isXACR, isXC} from "../selectors/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../reducers/EditorReducer"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonC, getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer5SelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xn = getX(m)
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
          d={getPolygonPath(xn, (isXC(m) || isXACR(m) || isXACC(m)) ? getPolygonC(m) : getPolygonS(m, xn, xn.selection), xn.selection, getSelectionMargin(m, xn))}
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
