import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {getG} from "../core/MapUtils"
import {mSelector} from "../state/EditorState"
import {RootState} from "../core/EditorReducer"
import {N} from "../state/MapPropTypes"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer6SelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    <g id="layer6">
      {intersectingNodes.map((n: N) => (
        <Fragment key={n.nodeId}>
          <path
            d={getPolygonPath(n, getPolygonS(m, n, 's'), 's', getSelectionMargin(m, n))}
            stroke={'#555555'}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
          >
          </path>
        </Fragment>
      ))}
    </g>
  )
}
