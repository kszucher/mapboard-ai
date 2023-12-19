import {FC} from "react"
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
        <g key={t.nodeId}>
          {t.fFillColor &&
            <path fill={t.fFillColor}{...pathCommonProps} d={getPolygonPath(m, t, 'sFamily', 0)}/>
          }
        </g>
      ))}
    </g>
  )
}
