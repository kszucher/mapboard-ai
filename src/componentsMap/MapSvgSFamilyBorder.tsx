import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {mS} from "../mapQueries/MapQueries.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSFamilyBorder: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mS(m).filter(si => si.fBorderColor).map(si =>
      <path
        key={`${si.nodeId}_fBorderColor`}
        d={getPolygonPath(m, si, 'sFamily', 0)}
        stroke={si.fBorderColor}
        strokeWidth={si.fBorderWidth}
        fill={'none'}
        {...pathCommonProps}
      />
    )
  )
}
