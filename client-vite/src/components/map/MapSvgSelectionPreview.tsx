import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {getCountTCO1} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {T} from "../../state/MapStateTypes.ts"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"

export const MapSvgSelectionPreview: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const intersectingNodes = useSelector((state: RootState) => state.editor.intersectingNodes)
  return (
    intersectingNodes.map((ti: T) => (
      <Fragment key={ti.nodeId}>
        {(ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || getCountTCO1(m, ti)) &&
          <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', 4)}/>
        }
        {!(ti.sBorderColor || ti.sFillColor || ti.taskStatus > 1 || getCountTCO1(m, ti)) &&
          <path stroke={'#555555'} strokeWidth={1} fill={'none'}{...pathCommonProps} d={getPolygonPath(m, ti, 'sSelf', -2)}/>
        }
      </Fragment>
    ))
  )
}
