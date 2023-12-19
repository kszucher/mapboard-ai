import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mT} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import { getPolygonPath } from "./MapSvgUtils"

export const MapSvgLayer1NodeFamilyBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g>
      {mT(m).map((t: T) => (
        <Fragment key={t.nodeId}>
          {
            t.fFillColor &&
            <path
              d={getPolygonPath(m, t, 'sFamily', 0)}
              fill={t.fFillColor}
              {...pathCommonProps}
            >
            </path>
          }
        </Fragment>
      ))}
    </g>
  )
}
