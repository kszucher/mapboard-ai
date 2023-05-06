import React, {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../editor/EditorReducer"
import {mSelector} from "../state/EditorState"
import {pathCommonProps} from "./MapSvg"
import { getPolygonPath, getStructPolygonPoints } from "./MapSvgUtils"
import {N} from "../state/MapPropTypes"

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
              d={getPolygonPath(n, getStructPolygonPoints(n, 'f'), 'f', 0)}
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
