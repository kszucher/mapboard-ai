import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../appStore/appStore.ts"
import {getColors} from "../consts/Colors.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {mS} from "../mapQueries/MapQueries.ts"
import {getArcPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSSelfBorder: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    mS(m).map(si => {
        if (si.sBorderColor && si.co1.length === 0) {
          return (
            <path
              key={`${si.nodeId}_sBorderColor`}
              d={getArcPath(si, -2, true)}
              stroke={si.sBorderColor}
              strokeWidth={si.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />
          )
        } else if (si.sBorderColor && si.co1.length > 0) {
          return (
            <path
              key={`${si.nodeId}_sBorderColor`}
              d={getArcPath(si, 0, false)}
              stroke={si.sBorderColor}
              strokeWidth={si.sBorderWidth}
              fill={'none'}
              {...pathCommonProps}
            />)
        } else if (!si.sBorderColor && si.co1.length > 0) {
          return (
            <path
              key={`${si.nodeId}_sBorderColor`}
              d={getArcPath(si, 0, false)}
              stroke={C.TABLE_FRAME_COLOR}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            />
          )
        }
      }
    )
  )
}
