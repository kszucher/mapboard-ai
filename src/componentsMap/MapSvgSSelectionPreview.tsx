import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../appStore/appStore.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {mS} from "../mapQueries/MapQueries.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgSSelectionPreview: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    mS(m).filter(si => intersectingNodes.includes(si.nodeId)).map(si => {
        if (si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) {
          return (
            <path
              key={`${si.nodeId}_preview`}
              stroke={'#555555'}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
              d={getPolygonPath(m, si, 'sSelf', 4)}
            />
          )
        } else {
          return (
            <path
              key={`${si.nodeId}_preview`}
              stroke={'#555555'}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
              d={getPolygonPath(m, si, 'sSelf', -2)}
            />
          )
        }
      }
    )
  )
}
