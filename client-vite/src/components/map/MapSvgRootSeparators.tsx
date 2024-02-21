import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {mR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {ControlType} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils.ts"
import {getLinearLinePath, pathCommonProps} from "./MapSvgUtils.ts"

export const MapSvgRootSeparators: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  return (
    connectionHelpersVisible &&
    mR(m).filter(ri => ri.controlType !== ControlType.NONE).map(ri => (
      <Fragment key={`${ri.nodeId}_separator`}>
        <path
          d={
            getLinearLinePath({
              x1: adjust(ri.nodeStartX),
              x2: adjust(ri.nodeStartX + ri.selfW),
              y1: adjust(ri.nodeStartY + 40),
              y2: adjust(ri.nodeStartY + 40),
            })
          }
          stroke={'#444'}
          {...pathCommonProps}
        />
        <path
          d={
            getLinearLinePath({
              x1: adjust(ri.nodeStartX),
              x2: adjust(ri.nodeStartX + ri.selfW),
              y1: adjust(ri.nodeStartY + ri.selfH - 40),
              y2: adjust(ri.nodeStartY + ri.selfH - 40),
            })
          }
          stroke={'#444'}
          {...pathCommonProps}
        />
      </Fragment>
    ))
  )
}
