import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {mTC} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils"

export const MapDivC: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  return (
    mTC(m).map(ti => (
      <div
        key={ti.nodeId}
        id={ti.nodeId}
        ref={ref => ref && ref.focus()}
        style={{
          left: adjust(ti.nodeStartX),
          top: adjust(ti.nodeStartY),
          minWidth: ti.selfW,
          minHeight: ti.selfH,
          position: 'absolute',
          zIndex: ti.path.length,
          border: 0,
          margin: 0,
          pointerEvents: leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE ? 'auto' : 'none'
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE) {
              !e.ctrlKey && md(MR.selectT, {path: ti.path})
            }
          } else if (e.buttons === 4) {
            e.preventDefault()
          }
        }}
      >
      </div>
    ))
  )
}
