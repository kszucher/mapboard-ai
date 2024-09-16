import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../editorMutations/EditorMutations.ts"
import {getNodeMode, getAXR, isAXR, mR} from "../mapQueries/MapQueries.ts"
import {LeftMouseMode, NodeMode} from "../consts/Enums.ts"
import {adjust} from "../utils/Utils.ts"
import {getROffsetCoords, mSelector} from "../editorQueries/EditorQueries.ts"

export const MapDivR: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
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
              if (!e.ctrlKey) dispatch(actions.selectR(ri.path))
              if (e.ctrlKey && isAXR(m) && !ri.selected) dispatch(actions.selectAddR(ri.path))
              if (e.ctrlKey && ri.selected && getAXR(m).length > 1) dispatch(actions.unselectR(ri.path))
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT_AND_MOVE && nodeMode === NodeMode.EDIT_ROOT) {
              if (!e.ctrlKey) dispatch(actions.selectR(ri.path))
              dispatch(actions.saveFromCoordinates({e}))
              const abortController = new AbortController()
              const {signal} = abortController
              window.addEventListener('mousemove', (e) => {
                e.preventDefault()
                didMove = true
                dispatch(actions.offsetRByDragPreview({r: ri, e}))
              }, {signal})
              window.addEventListener('mouseup', (e) => {
                abortController.abort()
                e.preventDefault()
                if (didMove) {
                  dispatch(actions.offsetRByDrag(getROffsetCoords()))
                  dispatch(actions.offsetRByDragPreviewClear())
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
