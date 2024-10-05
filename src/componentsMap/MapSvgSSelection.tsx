import {FC} from "react"
import {useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../api/Api.ts"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {RootState} from "../appStore/appStore.ts"
import {getColors} from "../consts/Colors.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {getAXS, getG, getXS, isAXS, mS} from "../mapQueries/MapQueries.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSSelection: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  if (!selectionRectCoords.length && isAXS(m)) {
    if (getAXS(m).length === 1) {
      if (xs.selection === 's') {
        if (xs.sBorderColor || xs.sFillColor || xs.taskStatus > 1 || xs.co1.length) {
          return (
            <path
              key={`${g.nodeId}_ssp`}
              stroke={C.SELECTION_COLOR}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
              d={getPolygonPath(m, xs, 'sSelf', 2)}
            />
          )
        } else {
          return (
            <path
              key={`${g.nodeId}_ssp`}
              stroke={C.SELECTION_COLOR}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
              d={getPolygonPath(m, xs, 'sSelf', -2)}
            />
          )
        }
      } else if (xs.selection === 'f') {
        return (
          <path
            key={`${g.nodeId}_ssp`}
            stroke={C.SELECTION_COLOR}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
            d={getPolygonPath(m, xs, 'sFamily', 4)}
          />
        )
      }
    } else if (getAXS(m).length > 1) {
      return mS(m).filter(si => si.selected).map(si => {
          if (si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) {
            return (
              <path
                key={`${si.nodeId}_sss`}
                stroke={C.SELECTION_COLOR}
                strokeWidth={1}
                fill={'none'}
                {...pathCommonProps}
                d={getPolygonPath(m, si, 'sSelf', 2)}
              />
            )
          } else {
            return (
              <path
                key={`${si.nodeId}_sss`}
                stroke={C.SELECTION_COLOR}
                strokeWidth={1}
                fill={'none'}
                {...pathCommonProps}
                d={getPolygonPath(m, si, 'sSelf', -2)}
              />
            )
          }
        }
      )
    }
  }
}
