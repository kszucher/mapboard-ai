import {FC} from "react"
import {useSelector} from "react-redux"
import {mT} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgNodeFamilyBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mT(m).map(ti => (
      ti.fFillColor &&
      <path
        key={`${ti.nodeId}_fFillColor`}
        d={getPolygonPath(m, ti, 'sFamily', 0)}
        fill={ti.fFillColor}
        {...pathCommonProps}
      />
    ))
  )
}
