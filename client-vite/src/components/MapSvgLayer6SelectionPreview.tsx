import React, {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../state/EditorState"
import {RootState} from "../reducers/EditorReducer"
import {T} from "../state/MapStateTypes"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonPath, getPolygonS} from "./MapSvgUtils"

export const MapSvgLayer6SelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    <g>
      {intersectingNodes.map((n: T) => (
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
