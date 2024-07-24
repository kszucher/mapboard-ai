import {FC} from "react"
import {useSelector} from "react-redux"
import {mS} from "../../mapQueries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer.ts"
import {getPolygonPath} from "./MapSvgUtils"

export const MapSvgSFamilyBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mS(m).map(si => (
      si.fFillColor &&
      <path
        key={`${si.nodeId}_fFillColor`}
        d={getPolygonPath(m, si, 'sFamily', 0)}
        fill={si.fFillColor}
        {...{vectorEffect: 'non-scaling-stroke'}}
        style={{
          transition: 'all 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          transitionProperty: 'd, fill, stroke-width',
        }}
      />
    ))
  )
}
