import {FC} from "react"
import {useSelector} from "react-redux"
import {mTS} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeBorderFamily: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mTS(m).map(ti => (
      ti.fBorderColor &&
      <path
        key={`${ti.nodeId}_fBorderColor`}
        d={getPolygonPath(m, ti, 'sFamily', 0)}
        stroke={ti.fBorderColor}
        strokeWidth={ti.fBorderWidth}
        fill={'none'}
        {...pathCommonProps}
      />
    ))
  )
}
