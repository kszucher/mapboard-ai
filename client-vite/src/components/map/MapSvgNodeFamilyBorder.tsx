import {FC} from "react"
import {useSelector} from "react-redux"
import {mS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeFamilyBorder: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mS(m).map(si => (
      si.fBorderColor &&
      <path
        key={`${si.nodeId}_fBorderColor`}
        d={getPolygonPath(m, si, 'sFamily', 0)}
        stroke={si.fBorderColor}
        strokeWidth={si.fBorderWidth}
        fill={'none'}
        {...pathCommonProps}
      />
    ))
  )
}
