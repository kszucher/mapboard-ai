import {FC, Fragment,} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes"
import {getSelectionMargin, pathCommonProps} from "./MapSvg"
import {getPolygonPath, getPolygonSelf} from "./MapSvgUtils"

export const MapSvgLayer6SelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    <g>
      {intersectingNodes.map((t: T) => (
        <Fragment key={t.nodeId}>
          <path
            d={getPolygonPath(t, getPolygonSelf(t), 's', getSelectionMargin(m, t))}
            stroke={'#555555'}
            strokeWidth={1}
            fill={'none'}
            {...pathCommonProps}
          >
          </path>
        </Fragment>
      ))}
    </g>
  )
}
