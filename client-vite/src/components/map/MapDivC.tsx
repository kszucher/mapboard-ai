import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getMapMode, mC} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, MapMode} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils"

export const MapDivC: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  return (
    mC(m).map(ci => (
      <div
        key={ci.nodeId}
        id={ci.nodeId}
        ref={ref => ref && ref.focus()}
        style={{
          left: adjust(ci.nodeStartX),
          top: adjust(ci.nodeStartY),
          minWidth: ci.selfW,
          minHeight: ci.selfH,
          position: 'absolute',
          zIndex: ci.path.length,
          border: 0,
          margin: 0,
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && mapMode === MapMode.EDIT_CELL
            ? 'auto'
            : 'none'
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT && mapMode === MapMode.EDIT_CELL) {
              !e.ctrlKey && md(MR.selectT, {path: ci.path})
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
