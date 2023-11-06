import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {getColors} from "../misc/Colors"
import {getX, isXACC, isXACR, mT} from "../../selectors/MapSelector"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
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
      {mT(m).map((t: T) => (
        <Fragment key={t.nodeId}>
          {
            !selectionRectCoords.length && t.selected && t.selected !== getX(m).selected && !isXACR(m) && !isXACC(m) &&
            <path
              d={getPolygonPath(t, getPolygonS(m, t, t.selection), t.selection, getSelectionMargin(m, t))}
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
