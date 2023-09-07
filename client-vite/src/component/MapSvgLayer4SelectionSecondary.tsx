import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/NodeApi"
import {getColors} from "./Colors"
import {getX, isXACC, isXACR} from "../core/MapUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {N} from "../state/MapStateTypes"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer4SelectionSecondary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    <g>
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            !selectionRectCoords.length && n.selected && n.selected !== getX(m).selected && !isXACR(m) && !isXACC(m) &&
            <path
              d={getPolygonPath(n, getPolygonS(m, n, n.selection), n.selection, getSelectionMargin(m, n))}
              stroke={C.SELECTION_COLOR}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
        </Fragment>
      ))}
    </g>
  )
}
