import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {S} from "../../state/MapStateTypes.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    intersectingNodes.map((si: S) => (
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
