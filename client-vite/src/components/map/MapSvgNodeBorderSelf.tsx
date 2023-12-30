import {FC} from "react"
import {useSelector} from "react-redux"
import {getCountTCO1, mTS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getArcPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeBorderSelf: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g>
      {mTS(m).map(ti => (
        <g key={ti.nodeId}>
          {ti.sBorderColor && getCountTCO1(m, ti) === 0 &&
            <path
              d={getArcPath(ti, -2, true)}
              stroke={ti.sBorderColor}
              strokeWidth={ti.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          }
        </g>
      ))}
    </g>
  )
}
