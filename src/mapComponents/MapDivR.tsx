import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions} from "../editorMutations/EditorMutations.ts"
import {getROffsetCoords, mSelector} from "../editorQueries/EditorQueries.ts"
import {LeftMouseMode, NodeMode} from "../editorState/EditorStateTypesEnums.ts"
import {R_PADDING} from "../mapConsts/MapConsts.ts"
import {getAXR, getNodeMode, isAXR, mR} from "../mapQueries/MapQueries.ts"
import {ControlType} from "../mapState/MapStateTypesEnums.ts"
import {AppDispatch, RootState} from "../rootComponent/RootComponent.tsx"
import {MapDivRIngestion} from "./MapDivRIngestion.tsx"

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
          position: 'absolute',
          left: (ri.nodeStartX),
          top: (ri.nodeStartY),
          transition: 'left 0.3s, top 0.3s',
          transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
          minWidth: ri.selfW,
          minHeight: ri.selfH,
          zIndex: ri.path.length,
          margin: 0,
          pointerEvents: leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT ? 'auto' : 'none'
        }}
        onMouseDown={(e) => {
          let didMove = false
          e.stopPropagation()
          if (e.buttons === 1) {
            if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT && !e.ctrlKey) {
              if (!e.shiftKey) dispatch(actions.selectR(ri.path))
              if (e.shiftKey && isAXR(m) && !ri.selected) dispatch(actions.selectRAdd(ri.path))
              if (e.shiftKey && ri.selected && getAXR(m).length > 1) dispatch(actions.unselectR(ri.path))
            } else if (leftMouseMode === LeftMouseMode.CLICK_SELECT && nodeMode === NodeMode.EDIT_ROOT && e.ctrlKey) {
              if (!e.shiftKey) dispatch(actions.selectR(ri.path))
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
        <div style={{
          position: 'relative',
          left: R_PADDING,
          top: R_PADDING,
          background: '#333333',
          width: ri.selfW - 2 * R_PADDING,
          height: ri.selfH - 2 * R_PADDING,
          pointerEvents: nodeMode === NodeMode.EDIT_ROOT ? 'none' : 'auto'
        }}>
          {ri.controlType === ControlType.INGESTION && <MapDivRIngestion ri={ri}/>}
        </div>
      </div>
    ))
  )
}
