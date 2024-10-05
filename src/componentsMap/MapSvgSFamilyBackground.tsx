import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {mS} from "../mapQueries/MapQueries.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSFamilyBackground: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    mS(m).filter(si => si.fFillColor).map(si =>
      <path
        key={`${si.nodeId}_fFillColor`}
        d={getPolygonPath(m, si, 'sFamily', 0)}
        fill={si.fFillColor}
        {...pathCommonProps}
      />
    )
  )
}
