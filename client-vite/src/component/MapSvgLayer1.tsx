import React, {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../state/EditorState"
import {RootState} from "../editor/EditorReducer"
import {N} from "../state/MapPropTypes"
import {pathCommonProps} from "./MapSvg"
import { getPolygonPath, getPolygonS } from "./MapSvgUtils"

export const MapSvgLayer1: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g id="layer1">
      {m.map((n: N) => (
        <Fragment key={n.nodeId}>
          {
            n.fFillColor &&
            <path
              key={`${n.nodeId}_svg_branchFill`}
              d={getPolygonPath(n, getPolygonS(m, n, 'f'), 'f', 0)}
              fill={n.fFillColor}
              {...pathCommonProps}
            >
            </path>
          }
        </Fragment>
      ))}
    </g>
  )
}
