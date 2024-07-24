import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {mS} from "../../mapQueries/MapQueries.ts"

export const MapSvgSSelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    mS(m).map(si => (
      intersectingNodes.includes(si.nodeId) &&
      <Fragment key={si.nodeId}>
        {(si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) &&
          <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, si, 'sSelf', 4)}/>
        }
        {!(si.sBorderColor || si.sFillColor || si.taskStatus > 1 || si.co1.length) &&
          <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, si, 'sSelf', -2)}/>
        }
      </Fragment>
    ))
  )
}
