import React, {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../state/EditorState"
import {RootState} from "../reducers/EditorReducer"
import {T} from "../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import { getPolygonPath, getPolygonS } from "./MapSvgUtils"

export const MapSvgLayer1NodeFamilyBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g>
      {m.map((n: T) => (
        <Fragment key={n.nodeId}>
          {
            n.fFillColor &&
            <path
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
