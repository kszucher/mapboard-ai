import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getMapMode, getXAR, isXAR, mR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, MapMode} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils"

export const MapDivR: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  return (
    mR(m).map(ri => (
      <div
        key={ri.nodeId}
        id={ri.nodeId}
        ref={ref => ref && ref.focus()}
        style={{
          left: adjust(ri.nodeStartX),
          top: adjust(ri.nodeStartY),
          minWidth: ri.selfW,
          minHeight: ri.selfH,
          position: 'absolute',
          zIndex: ri.path.length,
          border: 0,
          margin: 0,
          pointerEvents: ri.selected !== 1 && [
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
              !e.ctrlKey && md(MR.selectR, {path: ri.path})
              e.ctrlKey && isXAR(m) && !ri.selected && md(MR.selectAddR, {path: ri.path})
              e.ctrlKey && ri.selected && getXAR(m).length > 1 && md(MR.selectRemoveT, {path: ri.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && mapMode === MapMode.EDIT_ROOT) {
              !e.ctrlKey && md(MR.selectR, {path: ri.path})
              md(MR.saveFromCoordinates, {e})
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                md(MR.offsetRByDragPreview, {t: ri, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  md(MR.offsetRByDrag, {t: ri, e})
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
