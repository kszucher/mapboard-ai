import {FC} from "react"
import {useSelector} from "react-redux"
import {mS} from "../mapQueries/MapQueries.ts"
import {RootState} from "../editorMutations/EditorReducer.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts";

export const MapSvgSFamilyBorder: FC = () => {
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
