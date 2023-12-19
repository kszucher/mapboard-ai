import {FC} from "react"
import {useSelector} from "react-redux"
import {getCountTCO1} from "../../selectors/MapSelector.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
import {pathCommonProps} from "./MapSvg"
import {getPolygonPath, getPolygonSelf} from "./MapSvgUtils"

export const MapSvgLayer6SelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    <g>
      {intersectingNodes.map((t: T) => (
        <g key={t.nodeId}>
          {(t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
            <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(t, getPolygonSelf(t), 's', 4)}/>
          }
          {!(t.sBorderColor || t.sFillColor || t.taskStatus > 1 || getCountTCO1(m, t)) &&
            <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(t, getPolygonSelf(t), 's', -2)}/>
          }
        </g>
      ))}
    </g>
  )
}
