import {FC} from "react"
import {useSelector} from "react-redux"
import {mTS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeBorderFamily: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g>
      {mTS(m).map(ti => (
        <g key={ti.nodeId}>
          {ti.fBorderColor &&
            <path
              d={getPolygonPath(m, ti, 'sFamily', 0)}
              stroke={ti.fBorderColor}
              strokeWidth={ti.fBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
        </g>
      ))}
    </g>
  )
}
