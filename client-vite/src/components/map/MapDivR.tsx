import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getXA, isXR, mTR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, MapMode} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils"

export const MapDivR: FC = () => {
  const mapMode = useSelector((state: RootState) => state.editor.mapMode)
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  return (
    mTR(m).map(ti => (
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
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && mapMode === MapMode.EDIT_ROOT
            ? 'auto'
            : 'none'
        }}
        onMouseDown={(e) => {
          let didMove = false
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT && mapMode === MapMode.EDIT_ROOT) {
              !e.ctrlKey && md(MR.selectT, {path: ti.path})
              e.ctrlKey && isXR(m) && !ti.selected && md(MR.selectAddT, {path: ti.path})
              e.ctrlKey && ti.selected && getXA(m).length > 1 && md(MR.selectRemoveT, {path: ti.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && mapMode === MapMode.EDIT_ROOT) {
              !e.ctrlKey && md(MR.selectT, {path: ti.path})
              md(MR.saveFromCoordinates, {e})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                md(MR.offsetRByDragPreview, {t: ti, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  md(MR.offsetRByDrag, {t: ti, e})
                }
              }, {signal})
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
