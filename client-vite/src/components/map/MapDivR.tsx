import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getNodeMode, getXAR, isXAR, mR} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, NodeMode} from "../../state/Enums.ts"
import {adjust} from "../../utils/Utils"

export const MapDivR: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const dm = (type: MR, payload? : any) => dispatch(actions.mapReducer({type, payload}))
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
          pointerEvents: [
            LeftMouseMode.CLICK_SELECT,
            LeftMouseMode.CLICK_SELECT_AND_MOVE
          ].includes(leftMouseMode) && nodeMode === NodeMode.EDIT_ROOT
            ? 'auto'
            : 'none'
        }}
        onMouseDown={(e) => {
          let didMove = false
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT) {
              !e.ctrlKey && dm(MR.selectR, {path: ri.path})
              e.ctrlKey && isXAR(m) && !ri.selected && dm(MR.selectAddR, {path: ri.path})
              e.ctrlKey && ri.selected && getXAR(m).length > 1 && dm(MR.unselectR, {path: ri.path})
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && nodeMode === NodeMode.EDIT_ROOT) {
              !e.ctrlKey && dm(MR.selectR, {path: ri.path})
              dispatch(actions.saveFromCoordinates({e}))
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                dm(MR.offsetRByDragPreview, {t: ri, e})
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  dm(MR.offsetRByDrag, {t: ri, e})
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
